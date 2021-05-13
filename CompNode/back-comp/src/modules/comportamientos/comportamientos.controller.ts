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
	UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comportamiento } from 'src/entity';
import { ComportRepository } from './comportamientos.repository';

@Controller('nest/comportamientos')
export class ComportamientosController {
	constructor(
		@InjectRepository(ComportRepository)
		private readonly comportRepo: ComportRepository,
	) {}

	@Get('all')
	getAllComport(): Promise<Comportamiento[]> {
		return this.comportRepo.find({ relations: ['subModels'] });
	}

	@Get(':id')
	getComport(
		@Param('id') id: string,
		@Param('subModels') submodel: boolean,
		@Param('evaluaciones') evaluaciones: boolean,
	): Promise<Comportamiento> {
		var relaciones = submodel ? ['subModel'] : [];
		relaciones = evaluaciones ? ['subModel', 'subModel.evaluaciones'] : relaciones;
		return this.comportRepo.findOne({ id: id }, { relations: relaciones });
	}

	@Delete(':id')
	async deleteComport(@Param('id') id: string): Promise<boolean> {
		const compt = await this.comportRepo.findOne({ id: id }, { relations: ['subModels'] });

		if (!compt) {
			throw new NotFoundException('No existe ningun comportamiento con ese id');
		}
		if (compt.subModels.length !== 0) {
			throw new UnauthorizedException('Ese comportamiento esta asociado a un submodelo, no se puede borrar');
		}
		await compt.remove();
		return true;
	}

	@Post('')
	async createComport(@Body() compt: Comportamiento): Promise<boolean> {
		const existingCompt = await this.comportRepo.findOne({ id: compt.id });
		if (existingCompt) {
			throw new ConflictException('Comportamiento ya creado');
		}
		if (compt.descripcion === undefined || compt.subModels !== undefined) {
			throw new UnprocessableEntityException('Descripción nula o subModelos no nulos');
		}
		await this.comportRepo.save(compt);
		return true;
	}

	@Put('')
	async updateComport(@Body() compt: Comportamiento): Promise<boolean> {
		const existingCompt = await this.comportRepo.findOne({ id: compt.id }, { relations: ['subModels'] });
		if (!existingCompt) {
			throw new NotFoundException('No existe un comportamiento con ese id');
		}
		if (compt.subModels.length !== 0) {
			throw new UnauthorizedException('Ese comportamiento esta asociado a un submodelo, no se puede actualizar');
		}
		await this.comportRepo.save(compt);
		return true;
	}
}
