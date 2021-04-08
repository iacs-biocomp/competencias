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
import { Nivel } from 'src/entity/Nivel.entity';
import { NivelRepository } from './nivel.repository';
@Controller('nest/niveles')
export class NivelesController {
	constructor(
		@InjectRepository(NivelRepository)
		private readonly nivRepo: NivelRepository,
	) {}

	@Get('all')
	getAllNiv(): Promise<Nivel[]> {
		return this.nivRepo.find({ relations: ['subModels'] });
	}

	//TODO: Completar para añadir los parametros como queryparams y no como el id tal que :id
	@Get(':id')
	getNiv(
		@Param('id') id: string,
		@Param('subModels') submodel: boolean,
		@Param('evaluaciones') evaluaciones: boolean,
	): Promise<Nivel> {
		var relaciones = submodel ? ['subModel'] : [];
		relaciones = evaluaciones ? ['subModel', 'subModel.evaluaciones'] : relaciones;
		return this.nivRepo.findOne({ id: id }, { relations: relaciones });
	}

	@Delete(':id')
	async deleteNiv(@Param('id') id: string): Promise<boolean> {
		const nivel = await this.nivRepo.findOne({ id: id }, { relations: ['subModels'] });

		if (!nivel) {
			throw new NotFoundException('No existe ningun nivel con ese id');
		}
		if (nivel.subModels.length !== 0) {
			throw new UnauthorizedException('Ese nivel esta asociado a un submodelo, no se puede borrar');
		}
		nivel.remove();
		return true;
	}

	@Post('')
	async createNivel(@Body() nivel: Nivel): Promise<boolean> {
		const existingNivel = await this.nivRepo.findOne({ id: nivel.id });
		if (existingNivel) {
			throw new ConflictException('Nivel ya creada');
		}
		this.nivRepo.save(nivel);
		return true;
	}
	@Put('')
	async updateNiv(@Body() nivel: Nivel): Promise<boolean> {
		const existingNivel = await this.nivRepo.findOne({ id: nivel.id }, { relations: ['subModels'] });
		if (!existingNivel) {
			throw new NotFoundException('No existe un nivel con ese id');
		}
		//? Se pueden modificar los niveles asociados a un submodelo usado en una evaluación?
		if (nivel.subModels.length !== 0) {
			throw new UnauthorizedException('Ese nivel esta asociado a un submodelo, no se puede modificar');
		}
		this.nivRepo.save(nivel);
		return true;
	}
}
