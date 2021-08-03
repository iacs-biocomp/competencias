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
import { ICatCompWithNoModelsDTO, ICCompCContrDTO } from 'sharedInterfaces/DTO';
import { CatCompWithNoModelsDTO, CCompAddDTO } from 'src/DTO/cat-comp.DTO';
import { CatCompRepo } from '../catComp.repository';
import { CatCompService } from '../services/cat-comp.service';

@Controller('nest/catcomp')
export class CatCompController {
	constructor(
		@InjectRepository(CatCompRepo)
		private readonly catCompRepo: CatCompRepo,
		private readonly cCompSv: CatCompService,
	) {}

	/**
	 * @returns El DTO que contiene el id, descripcion y N°Modelos que usan una catComp
	 */
	@Get('withmodels')
	async getWithNumberOfModels(): Promise<CatCompWithNoModelsDTO[]> {
		const catCompsDTO: ICatCompWithNoModelsDTO[] = [];
		const catComps = await this.catCompRepo.find({ relations: ['models'] });
		catComps.forEach(cat => {
			catCompsDTO.push({ id: cat.id, description: cat.description, nModels: cat.models!.length });
		});
		return catCompsDTO;
	}

	/**
	 * Busca todas las catCompetenciales y su Categoria contractual asociada por defecto.
	 * @returns Promesa con las catcomps
	 */
	@Get('all')
	getAllCompt(): Promise<ICCompCContrDTO[]> {
		return this.cCompSv.getAll();
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<boolean> {
		const catComp = await this.cCompSv.getOne(id);
		if (!catComp) {
			throw new NotFoundException('No existe ninguna competencia con ese id');
		}
		if (catComp.catContr.length !== 0) {
			throw new BadRequestException('No se puede borrar una catComp que tiene una catContr asociada');
		}
		await this.catCompRepo.delete(catComp.id);
		return true;
	}

	/**
	 * @param catComp La nueva catComp, no ha de existir en la base de datos
	 * @returns	`true` si se ha creado `Exception` si ya existe
	 * @throws {@link ConflictException} Si la catComp ya ha sido creada
	 */
	@Post('')
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	async create(@Body() catComp: CCompAddDTO): Promise<boolean> {
		const existingCompt = await this.cCompSv.getOne(catComp.id);
		if (existingCompt) {
			throw new ConflictException('CatComp ya creada');
		}
		await this.cCompSv.save(catComp);
		return true;
	}

	/**
	 * metodo para actualizar una catComp
	 * @param catComp La catComp con los nuevos datos, el id ha de ser el de la catComp a actualizar
	 * @returns `true` si se ha actualizado `false` caso contrario
	 * @throws {NotFoundException} Si no existe una catComp con ese id en la bbdd
	 */
	@Put('')
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	async update(@Body() catComp: CCompAddDTO): Promise<boolean> {
		const existingCompt = await this.cCompSv.getOne(catComp.id);
		if (!existingCompt) {
			throw new NotFoundException('No existe una competencia con ese id');
		}
		await this.cCompSv.save(catComp);
		return true;
	}
}
