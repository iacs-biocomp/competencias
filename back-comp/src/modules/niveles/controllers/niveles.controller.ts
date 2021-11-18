import {
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	ParseBoolPipe,
	ParseIntPipe,
	Post,
	Put,
	UnauthorizedException,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'sharedInterfaces/Entity';
import { NivelGetDTO } from 'src/DTO';
import { Nivel } from 'src/entity';
import { SetRoles } from 'src/modules/role/decorators/role.decorator';
import { NivelRepository } from '../nivel.repository';
@Controller('api/niveles')
export class NivelesController {
	constructor(
		@InjectRepository(NivelRepository)
		private readonly nivRepo: NivelRepository,
	) {}

	@Get('all')
	getAllNiv(): Promise<Nivel[]> {
		return this.nivRepo.find({ relations: ['subModels'] });
	}

	@Get('reference')
	getAllRefNivs(): Promise<Nivel[]> {
		return this.nivRepo.find({ relations: ['subModels'], where: { reference: true } });
	}

	@Get('count-reference')
	@SetRoles(Roles.GESTOR, Roles.ADMIN)
	countComports(): Promise<number> {
		return this.nivRepo.count({ where: { reference: true } });
	}

	@Get(':id')
	getNiv(
		@Param('id', ParseIntPipe) id: number,
		@Param('subModels', ParseBoolPipe) submodel: boolean,
		@Param('evaluaciones', ParseBoolPipe) evaluaciones: boolean,
	): Promise<Nivel | undefined> {
		let relaciones = !!submodel ? ['subModel'] : [];
		relaciones = !!evaluaciones ? ['subModel', 'subModel.evaluaciones'] : relaciones;
		return this.nivRepo.findOne({ id: id }, { relations: relaciones });
	}

	@Delete(':id')
	async deleteNiv(@Param('id', ParseIntPipe) id: number): Promise<true> {
		const nivel = await this.nivRepo.findOne({ id: id }, { relations: ['subModels'] });
		if (!nivel) {
			throw new NotFoundException('No existe ningun nivel con ese id');
		}
		if (!Nivel.isNivelWithSubModels(nivel)) {
			throw new NotFoundException('Relations not loaded properly, subModels of nivel are undefined');
		}
		if (nivel.subModels.length !== 0) {
			throw new UnauthorizedException('Ese nivel esta asociado a un submodelo, no se puede borrar');
		}
		await this.nivRepo.remove(nivel);
		return true;
	}

	@Post('')
	async createNivel(@Body() nivel: Nivel): Promise<true> {
		// TODO: Refactor, use try/catch instead find if some level exist in database
		const existingNivel = await this.nivRepo.findOne({ id: nivel.id });
		if (existingNivel) {
			throw new ConflictException('Nivel ya creado');
		}
		nivel.reference = true;
		await this.nivRepo.save(nivel);
		return true;
	}

	/**
	 * TODO: tsdoc con throws
	 * @param nivel
	 * @returns
	 */
	@Put('')
	@SetRoles(Roles.ADMIN, Roles.GESTOR)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	async updateNiv(@Body() nivel: NivelGetDTO): Promise<true> {
		// TODO: Refactor, use try/catch instead find if some level exist in database
		const existingNivel = await this.nivRepo.findOne({ id: nivel.id }, { relations: ['subModels'] });
		if (!existingNivel) {
			// TODO: Translate to english
			throw new NotFoundException('No existe un nivel con ese id');
		}
		if (!Nivel.isNivelWithSubModels(existingNivel)) {
			throw new NotFoundException('Relations not loaded properly, subModels of nivel are undefined');
		}
		if (existingNivel.subModels.length !== 0) {
			// TODO: Translate to english
			throw new UnauthorizedException('Ese nivel esta asociado a un submodelo, no se puede modificar');
		}
		await this.nivRepo.save(nivel);
		return true;
	}
}
