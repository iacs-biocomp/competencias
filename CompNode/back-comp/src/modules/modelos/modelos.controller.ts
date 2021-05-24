import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvModel } from 'src/entity';
import { CatCompRepo } from '../cat-comp/catComp.repository';
import { EvModelRepo } from './modelos.repository';
import { SubModelRepo } from './subModel.repository';

//Probablemente mejor un picker en vez de omit para quitar los metodos
type NewModelDTO = Omit<EvModel, 'evs'>;
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
	referenceModel(@Param('cComp') catCompId: string): Promise<EvModel[]> {
		console.log('xd');
		return this.modelRepo.find({
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

	// TODO: Crear otro endpoint para modelos de referencia o con queryparam
	@Post('')
	async newModel(@Body() modeloDto: NewModelDTO): Promise<boolean> {
		console.log(modeloDto);
		let evModel = new EvModel();
		evModel.catComp = await this.catCompRepo.findOne({ id: modeloDto.catComp.id });
		evModel.subModels = modeloDto.subModels;
		evModel.reference = true;
		await this.modelRepo.save(evModel);
		await Promise.all(
			evModel.subModels.map(subModel => {
				subModel.modelos = [evModel];
				return this.subModelRepo.save(subModel);
			}),
		);
		return true;
		// * Si hay que guardar los submodelos por separado, ¿posible error al estar el array en null?
		// evModel.subModels.forEach(subM => subM.modelos.push(evModel));
		// this.subModelRepo.save(evModel.subModels);
	}
}
