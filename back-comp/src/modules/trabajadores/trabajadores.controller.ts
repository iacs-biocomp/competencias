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
	async getAllWorker(): Promise<ITrabajadorDTO[]> {
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
		return trabajadores.map<ITrabajadorDTO>(trab => {
			return {
				dni: trab.dni,
				apellidos: trab.apellidos,
				area: trab.area,
				catComp: trab.periodos[0].catComp?.id,
				catContr: trab.periodos[0].catContr?.id,
				departamento: trab.departamento,
				nombre: trab.nombre,
				unidad: trab.unidad,
				// TODO: Comprobar si hay que mandar un ITrabajadorDTO
				deleteable: false,
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

	//Proablemente @deprecated y cambiar a usuario??
	@Get('username/:usrname')
	getWrkByUsername(
		@Param('usrname') usrname: string,
		@Param('subModels') submodel: boolean,
		@Param('evaluaciones') evaluaciones: boolean,
	): Promise<Trabajador> {
		let relaciones = submodel ? ['subModel'] : [];
		relaciones = evaluaciones ? ['subModel', 'subModel.evaluaciones'] : relaciones;
		return this.trabRepo.findOne({ user: { username: usrname } }, { relations: relaciones });
	}

	@Delete(':dni')
	async deleteWorker(@Param('dni') dni: string): Promise<boolean> {
		const worker = await this.trabRepo.findOne({ dni: dni }, { relations: [''] });
		if (!worker) {
			throw new NotFoundException('No existe ningun worker con ese dni');
		}
		await this.trabRepo.remove(worker);
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
			[catComp, catContr] = await Promise.all([
				this.catCompRepo.findOne({ id: worker.catComp }),
				this.catContrRepo.findOne({ id: worker.catContr }),
			]);
			if (!catComp || !catContr) {
				throw new Error('');
			}
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
		const [trab, catContr, catComp] = await Promise.all([
			this.trabRepo.findOne(
				{ dni: worker.dni },
				{ relations: ['periodos', 'periodos.catContr', 'periodos.catComp', 'user'] },
			),
			this.catContrRepo.findOne({ id: worker.catContr }),
			this.catCompRepo.findOne({ id: worker.catComp }),
		]);
		if (!trab) {
			throw new NotFoundException('No existe un worker con ese dni');
		}
		//TODO: Refactor
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
				[latestPeriod.catComp, latestPeriod.catContr] = [catComp, catContr];
				latestPeriod.save();
			} else {
				[perActual.catComp, perActual.catContr] = [catComp, catContr];
				perActual.save();
			}
		}
		await this.trabRepo.save(worker);
		return true;
	}
}
