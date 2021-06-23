import {
	Body,
	ConflictException,
	UnprocessableEntityException,
	Controller,
	Get,
	Param,
	Post,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IEvaluacion } from 'sharedInterfaces/Entity';
import { Ev, Trabajador } from 'src/entity';
import { EvRepository } from './evaluaciones.repository';

@Controller('nest/evaluaciones')
export class EvaluacionesController {
	constructor(@InjectRepository(EvRepository) private readonly evRepo: EvRepository) {}

	@Get('')
	getAll(): Promise<Ev[]> {
		return this.evRepo.find();
	}

	@Get('user/:username')
	async getEvsOfUser(@Param('username') username: string): Promise<Ev[]> {
		const worker = await Trabajador.findOne({
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
			throw new NotFoundException(`No existe un trabajador con ${username} como nombre de usuario`);
		}
		let evs: Ev[] = [];
		//Esto recoge las evaluaciones de cada periodo y las añade a un array vacío
		worker.periodos.forEach(periodo => evs.push.apply(evs, periodo.catComp.evaluaciones));
		return evs.filter((ev, index) => evs.findIndex(evIndx => evIndx.id === ev.id) === index);
	}

	@Get(':id')
	async getOneById(@Param('id') evId: string): Promise<IEvaluacion> {
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

	@Post('')
	async createEv(@Body() ev: Ev): Promise<boolean> {
		if (await this.evRepo.findOne({ id: ev.id })) {
			throw new ConflictException(`Existe una ev con el id:${ev.id}`);
		}
		if (!ev.model) {
			throw new UnprocessableEntityException('La evaluación no tiene un modelo que exista en la bbdd');
		}
		ev.description = 'Default description';
		await this.evRepo.save(ev);
		return true;
	}
}
