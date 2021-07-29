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
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'sharedInterfaces/Entity';
import { EvAddDTO, UpdateEvShowingResultsDTO } from 'src/DTO/ev.DTO';
import { Ev, Trabajador } from 'src/entity';
import { SetRoles } from 'src/modules/role/decorators/role.decorator';
import { EvRepository } from '../evaluaciones.repository';
import { EvaluacionesService } from '../services/evaluaciones.service';

@Controller('nest/evaluaciones')
export class EvaluacionesController {
	constructor(
		@InjectRepository(EvRepository) private readonly evRepo: EvRepository,
		private readonly evSv: EvaluacionesService,
	) {}

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
		if (!Trabajador.isTrabajadorWithPeriodos(worker)) {
			throw new TypeError(`Periods relations not loaded correctly`);
		}

		let evs: Ev[] = [];
		//Esto recoge las evaluaciones de cada periodo y las añade a un array vacío
		worker.periodos.forEach(periodo => evs.push.apply(evs, periodo.catComp.evaluaciones));
		return evs.filter((ev, index) => evs.findIndex(evIndx => evIndx.id === ev.id) === index);
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

	@Post('')
	@SetRoles(Roles.ADMIN)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	async createEv(@Body() ev: EvAddDTO): Promise<true> {
		// TODO: add checks to ensure that model exists in database etc
		// const evDb = await this.evRepo.findOne({});
		if (!ev.model) {
			throw new UnprocessableEntityException('La evaluación no tiene un modelo que exista en la bbdd');
		}
		await this.evRepo.save(ev);
		return true;
	}

	@Post('showing-results')
	@SetRoles(Roles.ADMIN, Roles.GESTOR)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	async changeShowingResults(@Body() payloadDto: UpdateEvShowingResultsDTO) {
		this.evRepo.update({ id: payloadDto.id }, { isShowingResults: payloadDto.isShowingResults });
	}
}
