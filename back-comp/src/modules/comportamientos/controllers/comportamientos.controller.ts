import {
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	ParseBoolPipe,
	Post,
	Put,
	UnauthorizedException,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'sharedInterfaces/Entity';
import { ComportAddDTO, ComportPutDTO } from 'src/DTO';
import { Comportamiento } from 'src/entity';
import { SetRoles } from 'src/modules/role/decorators/role.decorator';
import { ComportRepository } from '../comportamientos.repository';
import { ComportamientosService } from '../services/comportamientos.service';

@Controller('api/comportamientos')
export class ComportamientosController {
	constructor(
		@InjectRepository(ComportRepository)
		private readonly comportRepo: ComportRepository,
		private readonly comportSv: ComportamientosService,
	) {}

	@Get('all')
	getAllComport(): Promise<Comportamiento[]> {
		return this.comportSv.findAll();
	}

	@Get(':id')
	getComport(
		@Param('id') id: string,
		@Param('subModels', ParseBoolPipe) submodel: boolean,
		@Param('evaluaciones', ParseBoolPipe) evaluaciones: boolean,
	): Promise<Comportamiento | undefined> {
		let relaciones = submodel ? ['subModel'] : [];
		relaciones = evaluaciones ? ['subModel', 'subModel.evaluaciones'] : relaciones;
		return this.comportRepo.findOne({ id: id }, { relations: relaciones });
	}

	@Delete(':id')
	@SetRoles(Roles.GESTOR, Roles.ADMIN)
	async deleteComport(@Param('id') id: string): Promise<boolean> {
		const comport = await this.comportSv.findOne(id);
		if (!comport) {
			throw new NotFoundException('No existe ningun comportamiento con ese id');
		}
		if (comport.subModels.length !== 0) {
			// TODO: Change exception type, not sure if UnauthorizedException is correct type
			throw new UnauthorizedException('Ese comportamiento esta asociado a un submodelo, no se puede borrar');
		}
		// TODO: refactor service
		// await this.comportSv.delete(id);
		comport.remove();
		return true;
	}

	@Post('')
	@SetRoles(Roles.GESTOR, Roles.ADMIN)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	async createComport(@Body() compt: ComportAddDTO): Promise<boolean> {
		const existingCompt = await this.comportRepo.findOne({ id: compt.id });
		if (existingCompt) {
			throw new ConflictException('Comportamiento ya creado');
		}
		await this.comportRepo.save(compt);
		return true;
	}

	@Put('')
	@SetRoles(Roles.GESTOR, Roles.ADMIN)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	async updateComport(@Body() comport: ComportPutDTO): Promise<boolean> {
		const comportDb = await this.comportSv.findOne(comport.id);
		if (!comportDb) {
			throw new NotFoundException('No existe un comportamiento con ese id');
		}
		if (comportDb.subModels.length !== 0) {
			throw new UnauthorizedException('Ese comportamiento esta asociado a un submodelo, no se puede actualizar');
		}
		await this.comportRepo.save(comport);
		return true;
	}
}
