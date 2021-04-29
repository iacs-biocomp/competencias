import { Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PeriodoTrab } from 'src/entity/PeriodoTrab.entity';
import { CatContr } from '../../entity/CatContr.entity';
import { PeriodosRepo } from '../trabajadores/periodos.repository';
import { CatContrRepo } from './catContr.repository';
// import { ICategoriesRelation } from '../../../../interfaces/ICategorias';
@Controller('nest/catcontr')
export class CatContractController {
	constructor(
		@InjectRepository(CatContrRepo)
		private readonly contrRepo: CatContrRepo,
		@InjectRepository(PeriodosRepo)
		private readonly periodosRepo: PeriodosRepo,
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
		const existingContr = await this.contrRepo.findOne({ id: catContr.id }, { relations: ['catComp'] });
		if (!existingContr) {
			throw new NotFoundException(`No existe una catContractual con el identificador ${catContr.id}`);
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
