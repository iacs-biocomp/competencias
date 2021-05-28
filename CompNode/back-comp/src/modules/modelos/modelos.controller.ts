import { Body, Controller, Get, Param, Post, UnprocessableEntityException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { INewEvModelDTO } from 'sharedInterfaces/DTO';
import { EvModel, SubModel } from 'src/entity';
import { CatCompRepo } from '../cat-comp/catComp.repository';
import { EvModelRepo } from './modelos.repository';
import { SubModelRepo } from './subModel.repository';

//Probablemente mejor un picker en vez de omit para quitar los metodos
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

	@Post('')
	async newModel(@Body() modeloDto: INewEvModelDTO, @Query('reference') isReference?: boolean): Promise<boolean> {
		console.log(modeloDto);
		const cComp = await this.catCompRepo.findOne({ id: modeloDto.catComp.id });
		if (!cComp) throw new UnprocessableEntityException('No existe esa categoría competencial');
		if (isReference) {
			if (!!this.modelRepo.findOne({ catComp: cComp, reference: true })) {
				throw new UnprocessableEntityException('Ya se ha creado el modelo de referencia de esa catComp');
			}
		}
		/** El modelo que se va a guardar en la db*/
		let evModel = new EvModel();
		evModel.catComp = cComp;
		const subModels = evModel.subModels.map(sub => {
			let mutSub = new SubModel();
			mutSub.competencia = sub.competencia;
			mutSub.comportamientos = sub.comportamientos;
			mutSub.nivel = sub.nivel;
			return mutSub;
		});
		evModel.subModels = subModels;
		evModel.reference = isReference;
		await this.modelRepo.save(evModel);
		// Se guardan los submodelos con la pk del modelo como fk
		await Promise.all(
			evModel.subModels.map(subModel => {
				subModel.modelos = [evModel];
				return this.subModelRepo.save(subModel);
			}),
		);
		return true;
	}
	@Post('')
	editModel(@Body() modeloDto: INewEvModelDTO): boolean {
		//TODO: Completar
		return false;
	}
}
