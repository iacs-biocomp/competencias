import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PeriodoTrab } from 'src/entity/PeriodoTrab.entity';
import { Trabajador } from 'src/entity/Trabajador.entity';
import { TrabajadorRepo } from '../trabajadores/trabajador.repository';
import { UserRepository } from '../users/user.repository';

interface Organigrama {
	inferiores: Trabajador[];
	superiores: Trabajador[];
	pares: Trabajador[];
}
interface UsrWithOrgani extends Organigrama {
	trabajador: Trabajador;
}

@Controller('nest/organigrama')
export class OrganigramaController {
	constructor(
		@InjectRepository(TrabajadorRepo)
		private readonly trabRepo: TrabajadorRepo,
		@InjectRepository(UserRepository)
		private readonly usrRepo: UserRepository,
	) {}

	@Get('all')
	async getAll(): Promise<UsrWithOrgani[]> {
		var workers = await this.trabRepo.find({
			relations: ['periodos', 'periodos.superiores', 'periodos.inferiores', 'periodos.pares'],
		});
		var fullOrgani: UsrWithOrgani[] = [];

		//Filtro los periodos de cada trabajador y me quedo solo con el actual (Como array)
		workers.forEach(wrk => {
			wrk.periodos = wrk.periodos.filter(per => per.actual);
			fullOrgani.push({
				inferiores: wrk.periodos[0].inferiores,
				superiores: wrk.periodos[0].superiores,
				pares: wrk.periodos[0].pares,
				//Añado undefined para luego quitarle el campo periodos
				trabajador: undefined,
			});
		});
		for (const i in fullOrgani) {
			delete workers[i].periodos;
			fullOrgani[i].trabajador = workers[i];
		}
		return fullOrgani;
	}

	//TODO: Completar para añadir los parametros como queryparams y no como el dni tal que :dni
	@Get(':username')
	async getOrganigramaUsr(@Param('username') username: string): Promise<Organigrama> {
		const usr = await this.usrRepo.findOne({ username: username }, { relations: ['trabajador'] });
		const dni = usr.trabajador.dni;
		const worker = await this.trabRepo.findOne(
			{ dni: dni },
			{
				relations: ['periodos', 'periodos.superiores', 'periodos.inferiores', 'periodos.pares'],
			},
		);

		const actualPer: PeriodoTrab = worker.periodos.filter(per => per.actual)[0];
		const organi: Organigrama = {
			inferiores: actualPer.inferiores,
			superiores: actualPer.superiores,
			pares: actualPer.pares,
		};
		return organi;
	}
}
