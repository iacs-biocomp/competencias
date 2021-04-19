import { Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatContr } from '../../entity/CatContr.entity';
import { CatContrRepo } from './catContr.repository';
// import { ICategoriesRelation } from '../../../../interfaces/ICategorias';
@Controller('nest/catcontr')
export class CatContractController {
	constructor(
		@InjectRepository(CatContrRepo)
		private readonly contrRepo: CatContrRepo,
	) {}

	@Get('all')
	async allContr(): Promise<CatContr[]> {
		return this.contrRepo.find({ relations: ['catComp'] });
	}

	@Delete(':id')
	async deleteContr(@Param('id') id: string): Promise<boolean> {
		const catContr = await this.contrRepo.findOne({ id: id });
		if (!catContr) {
			throw new NotFoundException('No existe ninguna competencia con ese id');
		}
		var oneWeekAgo: Date = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

		await catContr.remove();
		return true;
	}

	@Post('')
	async createCompt(@Body() catContr: CatContr): Promise<boolean> {
		const existingCompt = await this.contrRepo.findOne({ id: catContr.id });
		if (existingCompt) {
			throw new ConflictException('CatContr ya creada');
		}
		await this.contrRepo.save(catContr);
		return true;
	}
	@Put('')
	async updateCompt(@Body() catContr: CatContr): Promise<boolean> {
		const existingCompt = await this.contrRepo.findOne({ id: catContr.id });
		if (!existingCompt) {
			throw new NotFoundException('No existe una catContractual con ese id');
		}
		await this.contrRepo.save(catContr);
		return true;
	}
}
