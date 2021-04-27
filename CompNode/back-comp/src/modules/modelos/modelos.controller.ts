import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvModel } from 'src/entity/EvModel.entity';
import { SubModel } from 'src/entity/SubModel.entity';
import { CatCompRepo } from '../cat-comp/catComp.repository';
import { EvModelRepo } from './modelos.repository';

//Probablemente mejor un picker en vez de omit para quitar los metodos
type NewModelDTO = Omit<EvModel, 'evs'>;
@Controller('nest/modelos')
export class ModelosController {
	constructor(
		@InjectRepository(EvModelRepo)
		private readonly modelRepo: EvModelRepo,
		@InjectRepository(CatCompRepo)
		private readonly catCompRepo: CatCompRepo,
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
	async newModel(@Body() modelo: NewModelDTO) {
		console.log(modelo);
		var evModel = new EvModel();
		evModel.catComp = await this.catCompRepo.findOne({ id: modelo.catComp.id });
		console.log(modelo.subModels);
	}
}
