import { Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatComp } from '../../entity/CatComp.entity';
import { CatCompRepo } from './catComp.repository';

@Controller('nest/catcomp')
export class CatCompController {
	constructor(
		@InjectRepository(CatCompRepo)
		private readonly catCompRepo: CatCompRepo,
	) {}
	@Get('all')
	getAllCompt(): Promise<CatComp[]> {
		return this.catCompRepo.find();
	}

	@Delete(':id')
	async deleteCompt(@Param('id') id: string): Promise<boolean> {
		const compt = await this.catCompRepo.findOne({ id: id });
		if (!compt) {
			throw new NotFoundException('No existe ninguna competencia con ese id');
		}
		var oneWeekAgo: Date = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
		// if (oneWeekAgo >= compt.createdAt) {
		// 	throw new UnauthorizedException('No puedes borrar esa competencia');
		// }
		compt.remove();
		return true;
	}

	@Post('')
	async createCompt(@Body() compt: CatComp): Promise<boolean> {
		const existingCompt = await this.catCompRepo.findOne({ id: compt.id });
		if (existingCompt) {
			throw new ConflictException('CatComp ya creada');
		}
		// if (compt.createdAt != undefined && compt.descripcion === undefined) {
		// 	throw new UnprocessableEntityException('La descripción no ha de ser undefined y la fecha ha de ser undefined');
		// }
		this.catCompRepo.save(compt);
		return true;
	}
	@Put('')
	async updateCompt(@Body() compt: CatComp): Promise<boolean> {
		const existingCompt = await this.catCompRepo.findOne({ id: compt.id });
		if (!existingCompt) {
			throw new NotFoundException('No existe una competencia con ese id');
		}
		// if (compt.createdAt != undefined && compt.descripcion === undefined) {
		// 	throw new UnprocessableEntityException('La descripción no ha de ser undefined y la fecha ha de ser undefined');
		// }
		this.catCompRepo.save(compt);
		return true;
	}
}
