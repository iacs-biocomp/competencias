import {
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	Put,
	UnauthorizedException,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isBefore, subDays } from 'date-fns';
import { Competencia } from 'src/entity';
import { CompAddDTO, CompGetDTO } from 'src/DTO/competencias.DTO';
import { ComptRepository } from '../competencias.repository';
import { CompetenciasService } from '../services/competencias.service';
import { SetRoles } from 'src/modules/role/decorators/role.decorator';
import { Roles } from 'sharedInterfaces/Entity';
@Controller('nest/competencias')
export class CompetenciasController {
	constructor(
		@InjectRepository(ComptRepository)
		private readonly comptRepo: ComptRepository,
		private readonly compSv: CompetenciasService,
	) {}

	@Get('all')
	@SetRoles(Roles.PUBLIC)
	getAllCompt(): Promise<CompGetDTO[]> {
		return this.compSv.getAll();
	}

	// TODO: Comprobar si estaria bien usar una pipe de validación de string
	@Delete(':id')
	@SetRoles(Roles.ADMIN, Roles.GESTOR)
	async deleteCompt(@Param('id') id: string): Promise<boolean> {
		const compt = await this.compSv.getOneById(id);
		if (!compt) {
			throw new NotFoundException('No existe ninguna competencia con ese id');
		}
		const today = new Date();
		const oneWeekAgo = subDays(today, 7);
		if (isBefore(today, oneWeekAgo)) {
			throw new UnauthorizedException('No puedes borrar esa competencia');
		}
		await this.compSv.deleteOne(compt as Competencia);
		return true;
	}

	@Post('')
	@SetRoles(Roles.ADMIN, Roles.GESTOR)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	async createCompt(@Body() compt: CompAddDTO): Promise<boolean> {
		const existingCompt = await this.comptRepo.findOne({ id: compt.id });
		if (existingCompt) {
			throw new ConflictException('Competence already exists');
		}
		await this.comptRepo.save(compt);
		return true;
	}

	@Put('')
	@SetRoles(Roles.ADMIN, Roles.GESTOR)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	async updateCompt(@Body() compt: CompAddDTO): Promise<boolean> {
		console.log(compt);
		// const toFoo = ({ id, descripcion }: CompAddDTO): CompAddDTO => ({ id, descripcion });
		// const comp = CompAddDTOClass.build(compt);
		const existingCompt = await this.compSv.getOneById(compt.id);
		if (!existingCompt) {
			throw new NotFoundException('No existe una competencia con ese id');
		}
		await this.comptRepo.save(compt);
		return true;
	}
}
