import {
	Body,
	UnprocessableEntityException,
	Controller,
	Get,
	Param,
	Post,
	NotFoundException,
	UsePipes,
	ValidationPipe,
	ParseIntPipe,
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isWithinInterval } from 'date-fns';
import { deleteProps } from 'sharedCode/Utility';
import { Roles } from 'sharedInterfaces/Entity';
import { TrabajadorDTO } from 'src/DTO';
import { EvAddDTO, UpdateEvShowingResultsDTO } from 'src/DTO/ev.DTO';
import { Ev, Trabajador } from 'src/entity';
import { OrganigramaService } from 'src/modules/organigrama/services/organigrama.service';
import { SetRoles } from 'src/modules/role/decorators/role.decorator';
import { TrabajadorRepo } from 'src/modules/trabajadores/trabajador.repository';
import { DeepPartial, SelectQueryBuilder } from 'typeorm';
import { EvRepository } from '../evaluaciones.repository';
import { EvaluacionesService } from '../services/evaluaciones.service';

@Controller('api/evaluaciones')
export class EvaluacionesController {
	constructor(
		@InjectRepository(EvRepository) private readonly evRepo: EvRepository,
		@InjectRepository(TrabajadorRepo) private readonly wrkRepo: TrabajadorRepo,
		private readonly organiSv: OrganigramaService,
		private readonly evSv: EvaluacionesService,
	) {}

	@Get('')
	getAll(): Promise<Ev[]> {
		return this.evRepo.find();
	}

	@Get('user/:username')
	async getEvsOfUser(@Param('username') username: string): Promise<Ev[]> {
		// TODO: Fix method, this not get all evs of user
		const evsDb = await this.evRepo.find({
			relations: [
				'catComp',
				'catComp.periodosTrab',
				'catComp.periodosTrab.trabajador',
				'catComp.periodosTrab.superiores',
				'catComp.periodosTrab.pares',
				'catComp.periodosTrab.inferiores',
			],
		});
		console.log(evsDb);
		let evsUser: Ev[];
		const evsMapped = evsDb.map(ev => {
			const evMapped = {
				...ev,
				propuestasPeriod: { start: ev.iniDate, end: ev.finPropuestas } as Interval,
				validationPeriod: { start: ev.iniValidacion, end: ev.endValidacion } as Interval,
				valoracionPeriod: { start: ev.iniValoracion, end: ev.endValoracion } as Interval,
				evaluatedPeriod: { start: ev.iniPerEvaluado, end: ev.endPerEvaluado } as Interval,
			};
			return deleteProps(evMapped, [
				'iniDate',
				'finPropuestas',
				'iniValidacion',
				'endValidacion',
				'iniValoracion',
				'endValoracion',
				'iniPerEvaluado',
				'endPerEvaluado',
			]);
		});
		const now = new Date();
		const evsFiltered = evsMapped.filter(
			ev =>
				isWithinInterval(now, ev.propuestasPeriod) ||
				isWithinInterval(now, ev.validationPeriod) ||
				isWithinInterval(now, ev.valoracionPeriod),
		);
		// evsFiltered.filter(ev => )

		// evsFiltered;
		// QueryBuilder is used by this reason => https://is.gd/HmgH80
		const worker = await this.wrkRepo.findOne({
			join: {
				alias: 'trabajador',
				leftJoinAndSelect: {
					periodos: 'trabajador.periodos',
					catComp: 'periodos.catComp',
					evaluaciones: 'catComp.evaluaciones',
					model: 'evaluaciones.model',
				},
			},
			where: (qb: SelectQueryBuilder<Trabajador>) => {
				qb.where(`trabajador.user = '${username}' `);
			},
		});

		if (!worker) {
			throw new NotFoundException(`No existe un trabajador con ${username} como nombre de usuario`);
		}
		if (!Trabajador.isTrabajadorWithPeriodos(worker)) {
			throw new TypeError(`Periods relations not loaded correctly`);
		}

		let evs: Ev[] = [];
		worker.periodos.forEach(period =>
			period.catComp.evaluaciones?.forEach(ev => {
				if (!evs.find(evSaved => evSaved.id === ev.id)) {
					evs.push(ev);
				}
			}),
		);
		return evs;
		//Esto recoge las evaluaciones de cada periodo y las añade a un array vacío
		// worker.periodos.forEach(periodo => evs.push.apply(evs, periodo.catComp.evaluaciones));
		// return evs.filter((ev, index) => evs.findIndex(evIndx => evIndx.id === ev.id) === index);
	}

	@Get(':id')
	async getOneById(@Param('id') evId: string): Promise<Ev> {
		const ev = await this.evRepo.findOne(evId, {
			relations: [
				'model',
				'model.catComp',
				'model.subModels',
				'model.subModels.nivel',
				'model.subModels.competencia',
				'model.subModels.comportamientos',
			],
		});
		if (!ev) {
			throw new NotFoundException(`No existe una evaluacion con ${evId} como id`);
		}
		return ev;
	}

	@Get('organi/:user/:evId')
	async getWorkersToEval(
		@Param('user') username: string,
		@Param('evId', ParseIntPipe) evId: number,
	): Promise<TrabajadorDTO[]> {
		const [ev, worker] = await Promise.all([
			this.evRepo.findOne(evId),
			this.wrkRepo.findOne({ where: { user: username } }),
		]);
		if (!worker) {
			throw new BadRequestException(`No existe un trabajador registrado con username: ${username}`);
		}
		if (!ev) {
			throw new BadRequestException(`No existe una evaluacion con ${evId} como id`);
		}
		const periodsInRange = await this.organiSv.getUsrOrganisByRange(worker, {
			start: ev.iniPerEvaluado,
			end: ev.endPerEvaluado,
		});
		const periodos = periodsInRange.filter(period => isWithinInterval(ev.organiDate, period.interval));
		if (periodos.length > 1) {
			// TODO: Change console.log call to logger call
			console.log(
				new Error(
					`Existen periodos de una persona en la base de datos que tienen un intervalo de fechas con overlapping, persona: ${periodos[0]?.trabajador.dni}`,
				),
			);
			throw new InternalServerErrorException(`Error con los periodos de la evaluacion ${evId}`);
		}
		const periodo = periodos[0];
		if (!periodo) {
			return [];
		}
		const toEvalWorkers = [...periodo.inferiores, ...periodo.superiores, ...periodo.pares];
		return toEvalWorkers.map<TrabajadorDTO>(trab => {
			return { ...trab, departamento: trab.departamento ?? 'no-department' };
		});
	}

	@Post('')
	@SetRoles(Roles.ADMIN)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	async createEv(@Body() ev: EvAddDTO): Promise<true> {
		// TODO: check that model with that id exist in db, otherwise throw exception (use correct exception type)
		// const evDb = await this.evRepo.findOne({});
		if (!ev.model) {
			throw new UnprocessableEntityException('La evaluación no tiene un modelo que exista en la bbdd');
		}
		// TODO: Refactor using service
		await this.evRepo.save(ev as unknown as DeepPartial<Ev>);
		return true;
	}

	@Post('showing-results')
	@SetRoles(Roles.ADMIN, Roles.GESTOR)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	async changeShowingResults(@Body() payloadDto: UpdateEvShowingResultsDTO) {
		// TODO: Add validations, check if payloadDto.id is an id from one evaluation that exist in db
		this.evRepo.update({ id: payloadDto.id }, { isShowingResults: payloadDto.isShowingResults });
	}
}
