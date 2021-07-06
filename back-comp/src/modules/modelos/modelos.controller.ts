import { Body, Controller, Get, Param, Post, UnprocessableEntityException, Query, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { INewEvModelDTO, IRefModel } from 'sharedInterfaces/DTO';
import { Competencia, Comportamiento, EvModel, Nivel, SubModel } from 'src/entity';
import { CatCompRepo } from '../cat-comp/catComp.repository';
import { EvModelRepo } from './modelos.repository';
import { SubModelRepo } from './subModel.repository';

@Controller('nest/modelos')
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
	getReferenceModels() {
		return this.modelRepo.find({
			where: { reference: true },
			relations: ['catComp', 'subModels', 'subModels.nivel', 'subModels.competencia', 'subModels.comportamientos'],
		});
	}

	@Get('/reference/:cComp')
	referenceModel(@Param('cComp') catCompId: string): Promise<EvModel> {
		return this.modelRepo.findOne({
			where: { catComp: catCompId, reference: true },
			relations: ['catComp', 'subModels', 'subModels.nivel', 'subModels.competencia', 'subModels.comportamientos'],
		});
	}

	@Get(':cComp')
	modelsCatComp(@Param('cComp') catCompId: string): Promise<EvModel[]> {
		return this.modelRepo.find({
			where: { catComp: catCompId },
			relations: ['catComp', 'subModels', 'subModels.nivel', 'subModels.competencia', 'subModels.comportamientos'],
		});
	}

	@Get('')
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
	async newModel(@Body() modeloDto: INewEvModelDTO, @Query('reference') isReferenceStr?: string): Promise<EvModel> {
		console.log(modeloDto);
		const isReference = isReferenceStr === 'true' ? true : false;
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
		evModel.reference = isReference;
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
	async editModelfake(@Body() modeloDto: IRefModel, @Query('reference') isReference?: boolean): Promise<boolean> {
		if (!isReference) isReference = false;
		const cComp = await this.catCompRepo.findOne({ id: modeloDto.catComp.id });
		if (!cComp) throw new UnprocessableEntityException('No existe esa categoría competencial');
		if (isReference) {
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
				delete subM.id;
				return subM;
			});
			const subModelsSaved = await this.subModelRepo.save(subModelsNoId);
			dbModel.subModels = subModelsSaved;
			const subModelsDB = await this.subModelRepo.find({
				relations: ['competencia', 'nivel', 'comportamientos', 'modelos', 'modelos.catComp'],
			});
			console.log('subModelsDB', subModelsDB);
			await this.modelRepo.save(dbModel);
			return true;
		}
		return false;
	}

	@Put('reference2')
	async editModel(@Body() modeloDto: INewEvModelDTO, @Query('reference') isReference?: boolean): Promise<boolean> {
		if (!isReference) isReference = false;
		const cComp = await this.catCompRepo.findOne({ id: modeloDto.catComp.id });
		if (!cComp) throw new UnprocessableEntityException('No existe esa categoría competencial');
		if (isReference) {
			const dbModel = await this.modelRepo.findOne({ catComp: cComp, reference: true }, { relations: ['subModels'] });
			if (!dbModel) {
				throw new UnprocessableEntityException('No existe modelo de referencia de esa catComp');
			}
			const prevSubModels = dbModel.subModels;
			dbModel.subModels = modeloDto.subModels as SubModel[];
			this.subModelRepo.save(dbModel.subModels);
			this.modelRepo.save(dbModel);

			return true;
		}
		return false;
	}
}
