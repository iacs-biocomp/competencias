import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	UnprocessableEntityException,
	Query,
	Put,
	ParseBoolPipe,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { deleteProps } from 'sharedCode/Utility';
import { IEvModelAddDTO } from 'sharedInterfaces/DTO';
import { Roles } from 'sharedInterfaces/Entity';
import { EvModelRefUpdateDTO } from 'src/DTO';
import { Competencia, Comportamiento, EvModel, Nivel, SubModel } from 'src/entity';
import { CatCompRepo } from 'src/modules/cat-comp/catComp.repository';
import { SetRoles } from 'src/modules/role/decorators/role.decorator';
import { EvModelRepo } from '../modelos.repository';
import { SubModelRepo } from '../subModel.repository';

@Controller('api/modelos')
export class ModelosController {
	constructor(
		@InjectRepository(EvModelRepo)
		private readonly modelRepo: EvModelRepo,
		@InjectRepository(CatCompRepo)
		private readonly catCompRepo: CatCompRepo,
		@InjectRepository(SubModelRepo)
		private readonly subModelRepo: SubModelRepo,
	) {}

	@Get('references')
	@SetRoles(Roles.ADMIN, Roles.GESTOR)
	getReferenceModels() {
		return this.modelRepo.find({
			where: { reference: true },
			relations: ['catComp', 'subModels', 'subModels.nivel', 'subModels.competencia', 'subModels.comportamientos'],
		});
	}

	@Get('/reference/:cComp')
	@SetRoles(Roles.ADMIN, Roles.GESTOR)
	referenceModel(@Param('cComp') catCompId: string): Promise<EvModel | undefined> {
		return this.modelRepo.findOne({
			where: { catComp: catCompId, reference: true },
			relations: ['catComp', 'subModels', 'subModels.nivel', 'subModels.competencia', 'subModels.comportamientos'],
		});
	}

	@Get(':cComp')
	@SetRoles(Roles.ADMIN, Roles.GESTOR)
	modelsCatComp(@Param('cComp') catCompId: string): Promise<EvModel[]> {
		return this.modelRepo.find({
			where: { catComp: catCompId },
			relations: ['catComp', 'subModels', 'subModels.nivel', 'subModels.competencia', 'subModels.comportamientos'],
		});
	}

	@Get('')
	@SetRoles(Roles.ADMIN, Roles.GESTOR)
	allModels(): Promise<EvModel[]> {
		return this.modelRepo.find({
			relations: ['catComp', 'subModels', 'subModels.nivel', 'subModels.competencia', 'subModels.comportamientos'],
		});
	}

	/**
	 *
	 * @param modeloDto The evModel to create in database
	 * @param isReferenceStr QueryParam as string, parsed to true if equal to 'true' else false
	 * @returns
	 */
	@Post('')
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	@SetRoles(Roles.ADMIN, Roles.GESTOR)
	async newModel(
		@Body() modeloDto: IEvModelAddDTO,
		@Query('reference', ParseBoolPipe) isReference?: boolean,
	): Promise<EvModel | undefined> {
		const referenceParam = isReference ? true : false;
		// TODO: Refactor
		const cComp = await this.catCompRepo.findOne({ id: modeloDto.catComp.id });
		if (!cComp) throw new UnprocessableEntityException('No existe esa categoría competencial');
		if (isReference) {
			if (!!(await this.modelRepo.findOne({ catComp: cComp, reference: true }))) {
				throw new UnprocessableEntityException('Ya se ha creado el modelo de referencia de esa catComp');
			}
		}
		/** El modelo que se va a guardar en la db*/
		let evModel = new EvModel();
		evModel.catComp = cComp;
		const subModels = modeloDto.subModels.map(sub => {
			let mutSub = new SubModel();
			mutSub.competencia = sub.competencia as Competencia;
			mutSub.comportamientos = sub.comportamientos as Comportamiento[];
			mutSub.nivel = sub.nivel as Nivel;
			return mutSub;
		});
		evModel.subModels = subModels;
		evModel.reference = referenceParam;
		//TODO: Circular structure en esta variable, error al convertir a json
		const evModelSaved = await this.modelRepo.save(evModel);
		// Se guardan los submodelos con la pk del modelo como fk
		await Promise.all(
			evModel.subModels.map(subModel => {
				subModel.modelos = [evModel];
				return this.subModelRepo.save(subModel);
			}),
		);
		return this.modelRepo.findOne({ id: evModelSaved.id });
	}

	@Put('reference')
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	@SetRoles(Roles.ADMIN, Roles.GESTOR)
	async editRefModel(
		@Body() modeloDto: EvModelRefUpdateDTO,
		@Query('reference', ParseBoolPipe) isReference?: boolean,
	): Promise<boolean> {
		if (!isReference) isReference = false;
		const cComp = await this.catCompRepo.findOne({ id: modeloDto.catComp.id });
		if (!cComp) throw new UnprocessableEntityException('No existe esa categoría competencial');
		if (isReference) {
			// TODO: Move repo logic to services and use exact types not entity type.
			const dbModel = await this.modelRepo.findOne(
				{ catComp: cComp, reference: true },
				{
					relations: [
						'subModels',
						'subModels.competencia',
						'subModels.nivel',
						'subModels.comportamientos',
						'subModels.modelos',
						// 'subModels.modelos.catComp',
					],
				},
			);
			if (!dbModel) {
				throw new UnprocessableEntityException('No existe modelo de referencia de esa catComp');
			}
			// TODO: Refactor
			const prevSubModels = dbModel.subModels;
			//Se eliminan todos los subModelos que no tienen otro modelo distinto al que se modifica
			const promises = prevSubModels
				.map(s => {
					s.modelos = s.modelos.filter(modelo => modelo.id !== dbModel.id);
					const mapResult = s.modelos.length === 0 ? this.subModelRepo.remove(s) : undefined;
					console.log(mapResult);
					return mapResult;
				})
				.filter(promise => promise !== undefined);
			await Promise.all(promises);
			//Se borra el id de los nuevos subModelos para guardarlos
			const subModelsNoId = modeloDto.subModels.map(subM => {
				return deleteProps(subM, ['id']);
			});
			const subModelsSaved = await this.subModelRepo.save(subModelsNoId);
			dbModel.subModels = subModelsSaved;
			await this.modelRepo.save(dbModel);
			return true;
		}
		return false;
	}
}
