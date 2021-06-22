import { Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ITrabajadorDTO } from 'sharedInterfaces/DTO';
import { Trabajador, CatComp, CatContr } from 'src/entity';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { CatCompRepo } from '../cat-comp/catComp.repository';
import { CatContrRepo } from '../cat-contract/catContr.repository';
import { TrabajadorRepo } from './trabajador.repository';

@Controller('nest/trabajadores')
export class TrabajadoresController {
	constructor(
		@InjectRepository(TrabajadorRepo)
		private readonly trabRepo: TrabajadorRepo,
		@InjectRepository(CatCompRepo)
		private readonly catCompRepo: CatCompRepo,
		@InjectRepository(CatContrRepo)
		private readonly catContrRepo: CatContrRepo,
	) {}

	@Get('all')
	async getAllWorker() {
		//Tutorial seguido: https://is.gd/nNxUyX
		let trabajadores = await this.trabRepo.find({
			join: {
				alias: 'trabajador',
				leftJoinAndSelect: {
					periodos: 'trabajador.periodos',
					catComp: 'periodos.catComp',
					catContr: 'periodos.catContr',
				},
			},
			where: (qb: SelectQueryBuilder<Trabajador>) => {
				qb.where('periodos.actual = true');
			},
		});
		//Mapeo de Trabajador a ITrabajadorDTO
		return trabajadores.map(trab => {
			return {
				dni: trab.dni,
				apellidos: trab.apellidos,
				area: trab.area,
				catComp: trab.periodos[0].catComp?.id,
				catContr: trab.periodos[0].catContr?.id,
				departamento: trab.departamento,
				nombre: trab.nombre,
				unidad: trab.unidad,
			};
		});
	}

	//TODO: Completar para añadir los parametros como queryparams y no como el dni tal que :dni
	@Get(':dni')
	getWorker(
		@Param('dni') dni: string,
		@Param('subModels') submodel: boolean,
		@Param('evaluaciones') evaluaciones: boolean,
	): Promise<Trabajador> {
		let relaciones = submodel ? ['subModel'] : [];
		relaciones = evaluaciones ? ['subModel', 'subModel.evaluaciones'] : relaciones;
		return this.trabRepo.findOne({ dni: dni }, { relations: relaciones });
	}

	@Delete(':dni')
	async deleteWorker(@Param('dni') dni: string): Promise<boolean> {
		const worker = await this.trabRepo.findOne({ dni: dni }, { relations: [''] });
		if (!worker) {
			throw new NotFoundException('No existe ningun worker con ese dni');
		}
		await worker.remove();
		return true;
	}

	@Post('')
	async createTrabajador(@Body() worker: ITrabajadorDTO): Promise<boolean> {
		const existingTrabajador = await this.trabRepo.findOne({ dni: worker.dni });
		if (existingTrabajador) {
			throw new ConflictException('Trabajador ya creado');
		}
		let catComp: CatComp;
		let catContr: CatContr;
		try {
			catComp = await this.catCompRepo.findOne({ id: worker.catComp });
			catContr = await this.catContrRepo.findOne({ id: worker.catContr });
		} catch (error) {
			throw new NotFoundException(
				`No existe una catComp con este id: ${worker.catComp} o una catContr con este: ${worker.catContr}`,
			);
		}
		const trabajador = Trabajador.buildFromPost(worker);
		trabajador.periodos[0].catComp = catComp;
		trabajador.periodos[0].catContr = catContr;
		trabajador.periodos[0].trabajador = trabajador;
		await this.trabRepo.save(trabajador);
		await trabajador.periodos[0].save();
		return true;
	}

	@Put('')
	async updateWorker(@Body() worker: ITrabajadorDTO): Promise<boolean> {
		const promises = await Promise.all([
			this.trabRepo.findOne(
				{ dni: worker.dni },
				{ relations: ['periodos', 'periodos.catContr', 'periodos.catComp', 'user'] },
			),
			this.catContrRepo.findOne({ id: worker.catContr }),
			this.catCompRepo.findOne({ id: worker.catComp }),
		]);
		const trab = promises[0];
		const catContr = promises[1];
		const catComp = promises[2];

		if (!trab) {
			throw new NotFoundException('No existe un worker con ese dni');
		}
		//TODO: Pasar a un servicio el resto de este metodo https://is.gd/KUSLRU
		//Si estan actualizando la catComp o catContr y han pasado mas de 7 dias desde la creación del anterior periodo,
		//creo un nuevo periodo y cierro el actual
		let perActual = trab.periodos.find(p => p.actual);
		if (worker.catComp !== perActual.catComp.id || worker.catContr !== perActual.catContr.id) {
			const todayMinus7 = new Date(new Date().setDate(-7));
			if (perActual.createdAt < todayMinus7) {
				const latestPeriod = perActual;
				perActual.actual = false;
				perActual.save();
				delete latestPeriod.id;
				latestPeriod.catComp = catComp;
				latestPeriod.catContr = catContr;
				latestPeriod.save();
			} else {
				perActual.catComp = catComp;
				perActual.catContr = catContr;
				perActual.save();
			}
		}
		await this.trabRepo.save(worker);
		return true;
	}
}
