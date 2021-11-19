import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { deleteProps } from 'sharedCode/Utility';
import { Roles } from 'sharedInterfaces/Entity';
import { TrabAddDTO, TrabCCompCContrDTO } from 'src/DTO/trabajador.DTO';
import { Trabajador } from 'src/entity';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { CatCompRepo } from '../cat-comp/catComp.repository';
import { CatContrRepo } from '../cat-contract/catContr.repository';
import { SetRoles } from '../role/decorators/role.decorator';
import { TrabajadorRepo } from './trabajador.repository';

@Controller('api/trabajadores')
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
	async getAllWorker(): Promise<TrabCCompCContrDTO[]> {
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
		return trabajadores.map<TrabCCompCContrDTO>(trab => {
			return {
				dni: trab.dni,
				apellidos: trab.apellidos,
				area: trab.area,
				catComp: trab.periodos![0]!.catComp?.id,
				catContr: trab.periodos![0]!.catContr?.id,
				// TODO: Cambiar dto, preguntar a vega si puede haber caso con trabajador sin departamento
				departamento: trab.departamento ?? 'no department',
				nombre: trab.nombre,
				unidad: trab.unidad,
				// deleteable: false,
			};
		});
	}

	@Get(':dni')
	getWorker(
		@Param('dni') dni: string,
		@Param('subModels') submodel: boolean,
		@Param('evaluaciones') evaluaciones: boolean,
	): Promise<Trabajador | undefined> {
		let relaciones = submodel ? ['subModel'] : [];
		relaciones = evaluaciones ? ['subModel', 'subModel.evaluaciones'] : relaciones;
		return this.trabRepo.findOne({ dni: dni }, { relations: relaciones });
	}

	@Get('username/:usrname')
	async getWrkByUsername(@Param('usrname') usrname: string): Promise<Trabajador> {
		// TODO: Return Promise<**DTO>
		const wrk = await this.trabRepo.findOne({ user: { username: usrname } });
		if (!wrk) {
			// TODO: Refactor, not use const msg and change to 404 exception not 400
			const msg = `No worker exist associated with this username: ${usrname}`;
			throw new BadRequestException(msg);
		}
		return wrk;
	}

	@SetRoles(Roles.ADMIN, Roles.GESTOR)
	@Delete(':dni')
	async deleteWorker(@Param('dni') dni: string): Promise<true> {
		try {
			await this.trabRepo.delete({ dni: dni });
			return true;
		} catch (error) {
			throw new NotFoundException('No existe ningun worker con ese dni');
		}
	}

	@Post('')
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	async createTrabajador(@Body() worker: TrabAddDTO): Promise<boolean> {
		// TODO: Use try/catch and create method instead finding if worker exist in database
		const existingTrabajador = await this.trabRepo.findOne({ dni: worker.dni });
		if (existingTrabajador) {
			throw new ConflictException('Trabajador ya creado');
		}
		const [catComp, catContr] = await Promise.all([
			this.catCompRepo.findOne({ id: worker.catComp }),
			this.catContrRepo.findOne({ id: worker.catContr }),
		]);
		if (!catComp || !catContr) {
			throw new NotFoundException(
				`No existe una catComp con este id: ${worker.catComp} o una catContr con este: ${worker.catContr}`,
			);
		}
		const trabajador = Trabajador.buildFromPost(worker);
		trabajador.periodos![0]!.catComp = catComp;
		trabajador.periodos![0]!.catContr = catContr;
		trabajador.periodos![0]!.trabajador = trabajador;
		await this.trabRepo.save(trabajador);
		await trabajador.periodos![0]!.save();
		return true;
	}

	@Put('')
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	async updateWorker(@Body() worker: TrabAddDTO): Promise<boolean> {
		const [trabU, catContrU, catCompU] = await Promise.all([
			this.trabRepo.findOne(
				{ dni: worker.dni },
				{ relations: ['periodos', 'periodos.catContr', 'periodos.catComp', 'user'] },
			),
			this.catContrRepo.findOne({ id: worker.catContr }),
			this.catCompRepo.findOne({ id: worker.catComp }),
		]);
		if (!trabU || !catContrU || !catCompU) {
			throw new NotFoundException('Not found catComp || catContr || trab');
		}
		const [trab, catContr, catComp] = [trabU, catContrU, catCompU];
		if (!trab) {
			throw new NotFoundException('No existe un worker con ese dni');
		}
		//TODO: Refactor
		//TODO: Pasar a un servicio el resto de este metodo https://is.gd/KUSLRU
		//Si estan actualizando la catComp o catContr y han pasado mas de 7 dias desde la creación del anterior periodo,
		//creo un nuevo periodo y cierro el actual
		const perActual = trab.periodos!.find(p => p.actual)!;
		if (worker.catComp !== perActual.catComp.id || worker.catContr !== perActual.catContr.id) {
			const todayMinus7 = new Date(new Date().setDate(-7));
			if (perActual.createdAt < todayMinus7) {
				const latestPeriod = perActual;
				perActual.actual = false;
				perActual.save();
				const latestPeriodRm = deleteProps(latestPeriod, ['id']);
				[latestPeriodRm.catComp, latestPeriodRm.catContr] = [catComp, catContr];
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
