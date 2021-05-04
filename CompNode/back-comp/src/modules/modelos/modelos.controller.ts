import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvModel } from 'src/entity/EvModel.entity';
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

	@Get(':cComp')
	async modelsCatComp(@Param('cComp') catCompId: string) {
		return await this.modelRepo.find({
			where: { catComp: catCompId },
			relations: ['catComp', 'subModels', 'subModels.nivel', 'subModels.competencia', 'subModels.comportamientos'],
		});
	}
	@Get('')
	async allModels() {
		return await this.modelRepo.find({
			relations: ['catComp', 'subModels', 'subModels.nivel', 'subModels.competencia', 'subModels.comportamientos'],
		});
	}

	@Post('')
	async newModel(@Body() modeloDto: NewModelDTO) {
		let evModel = new EvModel();
		evModel.catComp = await this.catCompRepo.findOne({ id: modeloDto.catComp.id });
		evModel.catComp = modeloDto.catComp;
		evModel.subModels = modeloDto.subModels;
		this.modelRepo.save(evModel);
		// * Si hay que guardar los submodelos por separado, ¿posible error al estar el array en null?
		// evModel.subModels.forEach(subM => subM.modelos.push(evModel));
		// this.subModelRepo.save(evModel.subModels);
	}
}
