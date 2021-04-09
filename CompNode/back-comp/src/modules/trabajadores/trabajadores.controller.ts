import { Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trabajador } from 'src/entity/Trabajador.entity';
import { TrabajadorRepo } from './trabajador.repository';

@Controller('nest/trabajadores')
export class TrabajadoresController {
	constructor(
		@InjectRepository(TrabajadorRepo)
		private readonly trabRepo: TrabajadorRepo,
	) {}

	@Get('all')
	async getAllWorker() {
		var trabajadores = await this.trabRepo.find({ relations: ['periodos', 'periodos.catContr', 'periodos.catComp'] });
		//TODO: Usar queryBuilder o buscar manera para seleccionar solo el periodo activo y no filtrar en codigo
		//Filtro los periodos y escojo solo el activo
		trabajadores.forEach(trab => (trab.periodos = trab.periodos.filter(p => p.actual)));
		//Mapeo de Trabajador a ITrabajadorDTO
		var trabDto: ITrabajadorDTO[] = [];
		trabajadores.forEach(trab =>
			trabDto.push({
				dni: trab.dni,
				apellidos: trab.apellidos,
				area: trab.area,
				catComp: trab.periodos[0].catComp.id,
				catContr: trab.periodos[0].catContr.id,
				departamento: trab.departamento,
				nombre: trab.nombre,
				unidad: trab.unidad,
			}),
		);
		// trabajadores.map(t => t.periodos.filter(p => p.actual === true));
		return trabDto;
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
		return this.trabRepo.findOne({ dni: dni }, { relations: relaciones });
	}

	@Delete(':dni')
	async deleteWorker(@Param('dni') dni: string): Promise<boolean> {
		const worker = await this.trabRepo.findOne({ dni: dni }, { relations: ['subModels'] });

		if (!worker) {
			throw new NotFoundException('No existe ningun worker con ese dni');
		}
		// if (worker.subModels.length !== 0) {
		// 	throw new UnauthorizedException('Ese worker esta asociado a un submodelo, no se puede borrar');
		// }
		await worker.remove();
		return true;
	}

	@Post('')
	async createTrabajador(@Body() worker: Trabajador): Promise<boolean> {
		const existingTrabajador = this.trabRepo.findOne({ dni: worker.dni });
		if (existingTrabajador) {
			throw new ConflictException('Trabajador ya creada');
		}
		await this.trabRepo.save(worker);
		return true;
	}
	@Put('')
	async updateWorker(@Body() worker: Trabajador): Promise<boolean> {
		const existingTrabajador = this.trabRepo.findOne({ dni: worker.dni }, { relations: ['subModels'] });
		if (!existingTrabajador) {
			throw new NotFoundException('No existe un worker con ese dni');
		}
		//? Se pueden modificar los workeres asociados a un submodelo usado en una evaluación?
		// if (worker.subModels.length !== 0) {
		// 	throw new UnauthorizedException('Ese worker esta asociado a un submodelo, no se puede modificar');
		// }
		await this.trabRepo.save(worker);
		return true;
	}
}

interface ITrabajadorDTO {
	dni: string;

	nombre: string;

	apellidos: string;

	area: string;

	unidad: string;

	departamento: string;

	catComp: string;

	catContr: string;
}
