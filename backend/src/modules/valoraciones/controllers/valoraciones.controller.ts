import {
	BadRequestException,
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IJwtPayload, IResultadoDTOV2, IValoracionSettedDTO } from 'sharedInterfaces/DTO';
import { INivel, IValoracion, Roles } from 'sharedInterfaces/Entity';
import { Nivel, Valoracion } from 'src/entity';
import { ValoracionesRepo } from '../valoraciones.repository';
import { ApiParam } from '@nestjs/swagger';
import { parse } from 'cookie';
import { ConfigService } from 'src/config/config.service';
import { Configuration } from 'src/config/config.keys';
import { JwtService } from '@nestjs/jwt';
import { SelectQueryBuilder } from 'typeorm';
import { Request } from 'express';
import { ValoracionAddDTO, ValoracionUpdateDTO } from 'src/DTO';
import { OrganigramaService } from 'src/modules/organigrama/services/organigrama.service';
import { EvRepository } from 'src/modules/evaluaciones/evaluaciones.repository';
import { isAfter } from 'date-fns';
import { ComptRepository } from 'src/modules/competencias/competencias.repository';
import { ComportRepository } from 'src/modules/comportamientos/comportamientos.repository';
import { TrabajadorRepo } from 'src/modules/trabajadores/trabajador.repository';
import { uniq } from 'lodash';
import { SetRoles } from 'src/decorators/role.decorator';

@Controller('api/valoraciones')
export class ValoracionesController {
	constructor(
		@InjectRepository(ValoracionesRepo) private readonly valRepo: ValoracionesRepo,
		@InjectRepository(EvRepository) private readonly evRepo: EvRepository,
		@InjectRepository(ComptRepository) private readonly compRepo: ComptRepository,
		@InjectRepository(ComportRepository) private readonly comportRepo: ComportRepository,
		@InjectRepository(TrabajadorRepo) private readonly wrkRepo: TrabajadorRepo,
		private readonly jwtSv: JwtService,
		private readonly cnfSv: ConfigService,
		private readonly organiSv: OrganigramaService,
	) {}

	// ? Is a correct method name?
	@ApiParam({ name: 'dni', description: 'Evaluated DNI, not evaluator' })
	@Get('setted/:evId/:dni')
	async getSettedValsOfWorkerFromEv(
		@Req() req: Request,
		@Param('dni') dni: string,
		@Param('evId', ParseIntPipe) evId: number,
	): Promise<IValoracionSettedDTO[]> {
		// Probablemente innecesario usando authNGuard ya que usa esta misma cookie, 100% estara si pasa el guard
		const jwtName = this.cnfSv.get(Configuration.JWT_NAME)!;
		const cookiesStr = req.headers.cookie;
		const cookiesParsed = !!cookiesStr ? parse(cookiesStr) : {};
		const loginTknStr = cookiesParsed[jwtName];
		if (!loginTknStr) {
			throw new BadRequestException(`Cookie ${jwtName} must be sent`);
		}
		const jwt = this.jwtSv.decode(loginTknStr) as IJwtPayload;
		console.log(jwt);
		console.log(evId, dni);
		const vals = await this.valRepo.find({
			join: {
				alias: 'valoracion',
				leftJoinAndSelect: {
					evaluador: 'valoracion.evaluador',
					evaluado: 'valoracion.evaluado',
					ev: 'valoracion.ev',
					user: 'evaluador.user',
					nivel: 'valoracion.nivel',
					comp: 'valoracion.comp',
					comport: 'valoracion.comport',
				},
			},
			where: (qb: SelectQueryBuilder<Valoracion>) => {
				qb.where(`user.username = '${jwt.username}'`);
				qb.andWhere(`ev.id = ${evId}`);
				qb.andWhere(`evaluado.dni = '${dni}'`);
			},
		});
		//Mapping from Entity to DTO
		return vals.map<IValoracionSettedDTO>(val => {
			return {
				comp: val.comp.id,
				comport: val.comport.id,
				ev: val.ev.id,
				evaluado: val.evaluado.dni,
				evaluador: val.evaluador.dni,
				id: val.id,
				nivel: val.nivel.id,
				valoracion: val.valoracion,
			};
		});
	}

	@Get('admin/:dni/:evId')
	@SetRoles(Roles.ADMIN, Roles.GESTOR)
	async adminGetUserEvVals(
		@Param('dni') dni: string,
		@Param('evId', ParseIntPipe) evId: number,
	): Promise<Valoracion[]> {
		return this.valRepo.find({
			where: { evaluado: { dni: dni }, ev: { id: evId } },
			relations: ['evaluado', 'evaluador', 'ev', 'comport', 'comp'],
		});
	}

	/**
	 * TODO: Translate to english
	 * Guarda una nueva valoración en la DB
	 * @param val La valoración sin identificador a guardar en la DB
	 * @returns `true` en caso de que se haya guardado correctamente la valoración Excepción en caso contrario
	 */
	@Post('')
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	@UseGuards()
	async createVal(@Req() req: Request, @Body() val: ValoracionAddDTO): Promise<true> {
		const existentVal = await this.valRepo.findOne({
			where: { ev: { id: val.ev }, comp: { id: val.comp }, comport: { id: val.comport } },
		});

		if (!!existentVal) {
			throw new BadRequestException(
				'La valoración que se quiere crear ya existe, para actualizar realizar petición a endpoint PUT',
			);
		}

		const dbData = await Promise.all([
			{ name: 'evaluador', value: this.wrkRepo.findOne(val.evaluador) },
			{ name: 'evaluado', value: this.wrkRepo.findOne(val.evaluado) },
			{ name: 'evaluacion', value: this.evRepo.findOne(val.evaluado) },
			{ name: 'competencia', value: this.compRepo.findOne(val.comp) },
			{ name: 'comportamiento', value: this.comportRepo.findOne(val.comport) },
		]);

		const canSave = () => {
			return dbData.every(data => data.value !== undefined);
		};

		// TODO: Add some tests for ensure that work properly
		if (canSave()) {
			await this.valRepo.save(val as unknown as Valoracion);
		} else {
			throw new Error(
				`No existe ${dbData
					.filter(data => data.value !== undefined)
					.map(data => data.name)
					.join(', ')} con los identificadores enviados`,
			);
		}
		return true;
	}

	@ApiParam({ name: 'evId', type: 'integer', description: 'Evaluation id' })
	@ApiParam({ name: 'dni', type: 'string', description: "Evaluated worker's DNI" })
	@Get('resultados/:evId/:dni')
	async getEvUserResults(
		@Param('evId', ParseIntPipe) evId: number,
		@Param('dni') dni: string,
	): Promise<IResultadoDTOV2[]> {
		const [valoraciones, ev, wrk] = await Promise.all([
			this.valRepo.find({ where: { evaluado: dni, ev: evId }, relations: ['comp'] }),
			this.evRepo.findOne(evId),
			this.wrkRepo.findOne(dni),
		]);
		if (!ev) {
			throw new BadRequestException(`No existe una evaluación con el id ${evId}`);
		}
		if (wrk === undefined) {
			throw new BadRequestException(`No existe un trabajador con el dni ${dni}`);
		}

		const compsOfVals = uniq(valoraciones.map(val => val.comp));

		/** Periods in the evaluated range */
		const periodosInRange = await this.organiSv.getUsrOrganisByRange(wrk, {
			start: ev.iniPerEvaluado,
			end: ev.endPerEvaluado,
		});
		const latestPeriod = periodosInRange.reduce((acc, el) => {
			return isAfter(acc.interval.end, el.interval.end) ? acc : el;
		});

		const [infVals, parVals, supVals] = [
			valoraciones.filter(
				val => !!latestPeriod.inferiores.find(trab => trab.dni === (val.evaluador as unknown as string)),
			),
			valoraciones.filter(val => !!latestPeriod.pares.find(trab => trab.dni === (val.evaluador as unknown as string))),
			valoraciones.filter(
				val => !!latestPeriod.superiores.find(trab => trab.dni === (val.evaluador as unknown as string)),
			),
		];

		const filterValByComp = (vals: Valoracion[], comp: { id: string }) => {
			return vals.filter(val => val.comp.id === comp.id);
		};

		return compsOfVals.map<IResultadoDTOV2>(comp => {
			return {
				maxResult: 50,
				minResult: 20,
				competencia: comp.id,
				values: [
					{ name: 'Inferiores', value: computeResults(filterValByComp(infVals, comp)) },
					{ name: 'Pares', value: computeResults(filterValByComp(parVals, comp)) },
					{ name: 'Superiores', value: computeResults(filterValByComp(supVals, comp)) },
				],
			};
		});
	}

	/**
	 * Actualiza una valoración en la DB
	 * @param val La valoración con el identificador
	 * @returns `true` en caso de que se haya actualizado correctamente la valoración `false` o Excepción en caso contrario
	 */
	@Put('')
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	@SetRoles(Roles.PUBLIC)
	async editVal(@Body() val: ValoracionUpdateDTO): Promise<boolean> {
		if (!val) {
			throw new BadRequestException('Valoración undefined');
		}
		const valDb = await this.valRepo.findOne({ where: { id: val.id } });
		if (!valDb) {
			throw new NotFoundException(`No existe una valoración con este id: ${val.id}`);
		}
		await this.valRepo.update({ id: valDb.id }, { valoracion: val.valoracion });
		return true;
	}
}

// TODO: Refactor, move to sharedCode utils
export function computeResults(vals: Valoracion[]): number {
	const nivelesOfVals: Nivel[] = [];
	const findNivelFn = (code: string) => nivelesOfVals.find(niv => niv.code === code);
	const findAllValsOfLvl = (valorations: IValoracion[], level: INivel) => {
		return valorations.filter(v => v.nivel.code === level.code);
	};
	vals.forEach(val => {
		if (!findNivelFn(val.nivel.code)) {
			nivelesOfVals.push(val.nivel);
		}
	});
	return nivelesOfVals.reduce((accAllVals, lvl) => {
		const valsOfLvl = findAllValsOfLvl(vals, lvl);
		const valsSum = valsOfLvl.reduce<number>((acc, el) => {
			acc += el.valoracion;
			return acc;
		}, 0);
		const avgValOfLvl = valsSum / valsOfLvl.length;
		accAllVals += avgValOfLvl;
		return accAllVals;
	}, 0);
}
