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
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'sharedInterfaces/Entity';
import { CContrAndCCompDTO } from 'src/DTO';
import { CContrAddDTO } from 'src/DTO/cat-contr.DTO';
import { CatCompRepo } from 'src/modules/cat-comp/catComp.repository';
import { SetRoles } from 'src/modules/role/decorators/role.decorator';
import { PeriodosRepo } from 'src/modules/trabajadores/periodos.repository';
import { CatContrRepo } from '../catContr.repository';
import { CatContractService } from '../services/cat-contract.service';

@Controller('api/catcontr')
export class CatContractController {
	constructor(
		@InjectRepository(CatContrRepo)
		private readonly contrRepo: CatContrRepo,
		@InjectRepository(PeriodosRepo)
		private readonly periodosRepo: PeriodosRepo,
		@InjectRepository(CatCompRepo)
		private readonly catCompRepo: CatCompRepo,
		private readonly cContrSv: CatContractService,
	) {}

	@Get('all')
	async allContr(): Promise<CContrAndCCompDTO[]> {
		return this.cContrSv.getAll();
	}

	// TODO: Check incoming string param, validation pipe? think no
	@Delete(':id')
	@SetRoles(Roles.ADMIN)
	async deleteContr(@Param('id') id: string): Promise<boolean> {
		const catContr = await this.cContrSv.getOne(id);
		if (!catContr) {
			throw new NotFoundException('No existe ninguna competencia con ese id');
		}
		await this.cContrSv.delete(catContr);
		return true;
	}

	@Post('')
	@SetRoles(Roles.ADMIN)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	async createCompt(@Body() catContr: CContrAddDTO): Promise<boolean> {
		console.log(catContr);
		const existingCompt = await this.cContrSv.getOne(catContr.id);
		if (existingCompt) {
			throw new ConflictException('CatContr ya creada');
		}
		await this.contrRepo.save(catContr);
		return true;
	}

	@Put('')
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	@SetRoles(Roles.ADMIN)
	async updateCContr(@Body() catContr: CContrAndCCompDTO): Promise<boolean> {
		//Al actualiza una categoría contractual hay que actualizar todos los trabajadores que no tuviesen GR6 y tengan esa contractual
		const [existingContr, catComp] = await Promise.all([
			this.cContrSv.getOne(catContr.id),
			this.catCompRepo.findOne({ id: catContr.catComp.id }),
		]);
		if (!catComp) {
			throw new NotFoundException(`No existe una catContractual con el identificador ${catContr.id}`);
		}
		if (!existingContr) {
			throw new NotFoundException(`No existe una catComp con el identificador ${catContr.id}`);
		}
		//Actualiza los periodos actuales con esa misma categoría contractual y le añade la nueva competencial
		await this.periodosRepo.update(
			{ catContr: catContr, catComp: existingContr.catComp, actual: true },
			{ catComp: catContr.catComp },
		);
		await this.contrRepo.save(catContr);
		return true;
	}
}
