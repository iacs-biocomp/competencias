import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvModel } from 'src/entity/EvModel.entity';
import { CatCompRepo } from '../cat-comp/catComp.repository';
import { EvModelRepo } from './modelos.repository';

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
		console.log(catCompId);
		return await this.modelRepo.find();
	}

	@Post('')
	async newModel(@Body() modelo: NewModelDTO) {
		var evModel = new EvModel();
		evModel.catComp = await this.catCompRepo.findOne({ id: 'GR1' });
		console.log(evModel);

		console.log(modelo);
	}
}
interface NewModelDTO extends Omit<EvModel, 'evs'> {}
