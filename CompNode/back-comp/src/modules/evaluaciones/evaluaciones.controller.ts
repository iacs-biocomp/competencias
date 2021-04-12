import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatComp } from '../../entity/CatComp.entity';
import { Ev } from '../../entity/Ev.entity';
import { EvModel } from '../../entity/EvModel.entity';
import { Trabajador } from '../../entity/Trabajador.entity';
import { EvRepository } from './evaluaciones.repository';

@Controller('nest/evaluaciones')
export class EvaluacionesController {
	constructor(@InjectRepository(EvRepository) private readonly evRepo: EvRepository) {}

	@Get(':username')
	async getEvsOfUser(@Param('username') username: string) {
		var worker = await Trabajador.findOne({
			where: { user: username },
			relations: [
				'periodos',
				'periodos.catComp',
				'periodos.catComp.evaluaciones',
				'periodos.catComp.evaluaciones.catComp',
				'periodos.catComp.evaluaciones.model',
			],
		});
		if (!worker) {
			return;
		}
		var evs: Ev[] = [];
		//Esto recoge las evaluaciones de cada periodo y las añade a un array vacío
		worker.periodos.forEach(periodo => evs.push.apply(evs, periodo.catComp.evaluaciones));
		return evs;
	}

	@Get('insert')
	async insertEvsTes() {
		// return await CatComp.find();
		const cattComp = await CatComp.findOne({ where: { id: 'GR1' } });
		var lel: Ev = Ev.create();
		lel.catComp = cattComp;
		lel.description = 'Descripción de evaluación';
		lel.id = 'Ev2';
		lel.model = await EvModel.findOne({ where: { catComp: cattComp } });
		return lel;
	}
}
