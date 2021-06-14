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
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatComp } from 'src/entity';
import { CatCompRepo } from './catComp.repository';

type CatCompWithNoModels = {
	/**El numero de modelos en los que aparece esa categoría competencial */
	nModels: number;
} & Pick<CatComp, 'id' | 'description'>;

@Controller('nest/catcomp')
export class CatCompController {
	constructor(
		@InjectRepository(CatCompRepo)
		private readonly catCompRepo: CatCompRepo,
	) {}

	/**
	 * @returns El DTO que contiene el id, descripcion y N°Modelos que usan una catComp
	 */
	@Get('withmodels')
	async getWithNumberOfModels() {
		//TODO: Refactor del metodo, buscar como usar Record y Omit, o una manera mas eficiente de convertir clases a interfaces/tipos DTO.
		var catCompsDTO: CatCompWithNoModels[] = [];
		const catComps = await this.catCompRepo.find({ relations: ['models'] });
		catComps.forEach(cat => {
			catCompsDTO.push({ id: cat.id, description: cat.description, nModels: cat.models.length });
		});
		return catCompsDTO;
	}

	/**
	 * Busca todas las catCompetenciales y su Categoria contractual asociada por defecto.
	 * @returns Promesa con las catcomps
	 */
	@Get('all')
	getAllCompt(): Promise<CatComp[]> {
		return this.catCompRepo.find({ relations: ['catContr'] });
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<boolean> {
		const catComp = await this.catCompRepo.findOne({ id: id }, { relations: ['catContr'] });
		if (!catComp) {
			throw new NotFoundException('No existe ninguna competencia con ese id');
		}
		if (catComp.catContr.length !== 0) {
			throw new BadRequestException('No se puede borrar una catComp que tiene una catContr asociada');
		}
		var oneWeekAgo: Date = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
		await catComp.remove();
		return true;
	}

	/**
	 *
	 * @param catComp La nueva catComp, no ha de existir en la base de datos
	 * @returns	`true` si se ha creado `Exception` si ya existe
	 * @throws {ConflictException} Si la catComp ya ha sido creada
	 */
	@Post('')
	async create(@Body() catComp: CatComp): Promise<boolean> {
		const existingCompt = await this.catCompRepo.findOne({ id: catComp.id });
		if (existingCompt) {
			throw new ConflictException('CatComp ya creada');
		}
		// if (catComp.createdAt != undefined && catComp.descripcion === undefined) {
		// 	throw new UnprocessableEntityException('La descripción no ha de ser undefined y la fecha ha de ser undefined');
		// }
		await this.catCompRepo.save(catComp);
		return true;
	}

	/**
	 * metodo para actualizar una catComp
	 * @param catComp La catComp con los nuevos datos, el id ha de ser el de la catComp a actualizar
	 * @returns `true` si se ha actualizado `false` caso contrario
	 * @throws {NotFoundException} Si no existe una catComp con ese id en la bbdd
	 */
	@Put('')
	async update(@Body() catComp: CatComp): Promise<boolean> {
		const existingCompt = await this.catCompRepo.findOne({ id: catComp.id });
		if (!existingCompt) {
			throw new NotFoundException('No existe una competencia con ese id');
		}
		//? Preguntar a vega si se puede modificar una catComp si tiene alguna evaluación anterior o en curso
		// if (catComp.createdAt != undefined && catComp.descripcion === undefined) {
		// 	throw new UnprocessableEntityException('La descripción no ha de ser undefined y la fecha ha de ser undefined');
		// }
		await this.catCompRepo.save(catComp);
		return true;
	}
}
