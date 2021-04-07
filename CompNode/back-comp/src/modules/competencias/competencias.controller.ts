import { UnprocessableEntityException } from '@nestjs/common';
import {
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	Put,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Competencia } from '../../entity/Competencia.entity';
import { ComptRepository } from './competencias.repository';

@Controller('nest/competencias')
export class CompetenciasController {
	constructor(
		@InjectRepository(ComptRepository)
		private readonly comptRepo: ComptRepository,
	) {}
	@Get('all')
	getAllCompt(): Promise<Competencia[]> {
		return this.comptRepo.find();
	}

	@Delete(':id')
	async deleteCompt(@Param('id') id: string): Promise<boolean> {
		const compt = await this.comptRepo.findOne({ id: id });
		if (!compt) {
			throw new NotFoundException('No existe ninguna competencia con ese id');
		}
		var oneWeekAgo: Date = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
		if (oneWeekAgo >= compt.createdAt) {
			throw new UnauthorizedException('No puedes borrar esa competencia');
		}
		compt.remove();
		return true;
	}

	@Post('')
	async createCompt(@Body() compt: Competencia): Promise<boolean> {
		const existingCompt = await this.comptRepo.findOne({ id: compt.id });
		if (existingCompt) {
			throw new ConflictException('Competencia ya creada');
		}
		if (compt.createdAt != undefined && compt.descripcion === undefined) {
			throw new UnprocessableEntityException('La descripción no ha de ser undefined y la fecha ha de ser undefined');
		}
		this.comptRepo.save(compt);
		return true;
	}
	@Put('')
	async updateCompt(@Body() compt: Competencia): Promise<boolean> {
		const existingCompt = await this.comptRepo.findOne({ id: compt.id });
		if (!existingCompt) {
			throw new NotFoundException('No existe una competencia con ese id');
		}
		if (compt.createdAt != undefined && compt.descripcion === undefined) {
			throw new UnprocessableEntityException('La descripción no ha de ser undefined y la fecha ha de ser undefined');
		}
		this.comptRepo.save(compt);
		return true;
	}
}
