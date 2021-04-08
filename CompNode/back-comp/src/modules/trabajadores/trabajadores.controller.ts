import { Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trabajador } from 'src/entity/Trabajador.entity';
import { TrabajadorRepo } from './trabajador.repository';

@Controller('trabajadores')
export class TrabajadoresController {
	constructor(
		@InjectRepository(TrabajadorRepo)
		private readonly nivRepo: TrabajadorRepo,
	) {}

	@Get('all')
	getAllWorker(): Promise<Trabajador[]> {
		return this.nivRepo.find({ relations: ['subModels'] });
	}

	//TODO: Completar para añadir los parametros como queryparams y no como el dni tal que :dni
	@Get(':dni')
	getWorker(
		@Param('dni') dni: string,
		@Param('subModels') submodel: boolean,
		@Param('evaluaciones') evaluaciones: boolean,
	): Promise<Trabajador> {
		var relaciones = submodel ? ['subModel'] : [];
		relaciones = evaluaciones ? ['subModel', 'subModel.evaluaciones'] : relaciones;
		return this.nivRepo.findOne({ dni: dni }, { relations: relaciones });
	}

	@Delete(':dni')
	async deleteWorker(@Param('dni') dni: string): Promise<boolean> {
		const worker = await this.nivRepo.findOne({ dni: dni }, { relations: ['subModels'] });

		if (!worker) {
			throw new NotFoundException('No existe ningun worker con ese dni');
		}
		// if (worker.subModels.length !== 0) {
		// 	throw new UnauthorizedException('Ese worker esta asociado a un submodelo, no se puede borrar');
		// }
		worker.remove();
		return true;
	}

	@Post('')
	async createTrabajador(@Body() worker: Trabajador): Promise<boolean> {
		const existingTrabajador = this.nivRepo.findOne({ dni: worker.dni });
		if (existingTrabajador) {
			throw new ConflictException('Trabajador ya creada');
		}
		this.nivRepo.save(worker);
		return true;
	}
	@Put('')
	async updateWorker(@Body() worker: Trabajador): Promise<boolean> {
		const existingTrabajador = this.nivRepo.findOne({ dni: worker.dni }, { relations: ['subModels'] });
		if (!existingTrabajador) {
			throw new NotFoundException('No existe un worker con ese dni');
		}
		//? Se pueden modificar los workeres asociados a un submodelo usado en una evaluación?
		// if (worker.subModels.length !== 0) {
		// 	throw new UnauthorizedException('Ese worker esta asociado a un submodelo, no se puede modificar');
		// }
		this.nivRepo.save(worker);
		return true;
	}
}
