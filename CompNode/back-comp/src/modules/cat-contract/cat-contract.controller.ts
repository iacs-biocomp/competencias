import { Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatContr } from '../../entity/CatContr.entity';
import { CatCompRepo } from '../cat-comp/catComp.repository';
import { PeriodosRepo } from '../trabajadores/periodos.repository';
import { CatContrRepo } from './catContr.repository';
@Controller('nest/catcontr')
export class CatContractController {
	constructor(
		@InjectRepository(CatContrRepo)
		private readonly contrRepo: CatContrRepo,
		@InjectRepository(PeriodosRepo)
		private readonly periodosRepo: PeriodosRepo,
		@InjectRepository(CatCompRepo)
		private readonly catCompRepo: CatCompRepo,
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
	async updateCContr(@Body() catContr: CatContr): Promise<boolean> {
		//Al actualiza una categoría contractual hay que actualizar todos los trabajadores que no tuviesen GR6 y tengan esa contractual
		const promises = await Promise.all([
			this.contrRepo.findOne({ id: catContr.id }, { relations: ['catComp'] }),
			this.catCompRepo.findOne({ id: catContr.catComp.id }),
		]);
		const existingContr = promises[0];
		const catComp = promises[1];
		if (!catComp) {
			throw new NotFoundException(`No existe una catContractual con el identificador ${catContr.id}`);
		}
		if (!existingContr) {
			throw new NotFoundException(`No existe una catComp con el identificador ${catContr.id}`);
		}

		//Actualiza los periodos actuales con esa misma categoría contractual y le añade la nueva competencial
		await this.periodosRepo.update(
			{ catContr: catContr, catComp: existingContr.catComp, actual: true },
			{ catComp: catContr.catComp },
		);
		await this.contrRepo.save(catContr);
		return true;
	}
}
