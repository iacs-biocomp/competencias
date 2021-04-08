import { Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatComp } from '../../entity/CatComp.entity';
import { CatCompRepo } from './catComp.repository';

@Controller('nest/catcomp')
export class CatCompController {
	constructor(
		@InjectRepository(CatCompRepo)
		private readonly catCompRepo: CatCompRepo,
	) {}
	// TODO: Añadir tsdoc restante

	@Get('all')
	getAllCompt(): Promise<CatComp[]> {
		return this.catCompRepo.find();
	}

	@Delete(':id')
	async deleteCompt(@Param('id') id: string): Promise<boolean> {
		const catComp = await this.catCompRepo.findOne({ id: id });
		if (!catComp) {
			throw new NotFoundException('No existe ninguna competencia con ese id');
		}
		var oneWeekAgo: Date = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
		// if (oneWeekAgo >= catComp.createdAt) {
		// 	throw new UnauthorizedException('No puedes borrar esa competencia');
		// }
		catComp.remove();
		return true;
	}

	/**
	 *
	 * @param catComp La nueva catComp, no ha de existir en la base de datos
	 * @returns	`true` si se ha creado `Exception` si ya existe
	 * @throws //TODO: Complete
	 */
	@Post('')
	async createCompt(@Body() catComp: CatComp): Promise<boolean> {
		const existingCompt = await this.catCompRepo.findOne({ id: catComp.id });
		if (existingCompt) {
			throw new ConflictException('CatComp ya creada');
		}
		// if (catComp.createdAt != undefined && catComp.descripcion === undefined) {
		// 	throw new UnprocessableEntityException('La descripción no ha de ser undefined y la fecha ha de ser undefined');
		// }
		this.catCompRepo.save(catComp);
		return true;
	}

	/**
	 * metodo para actualizar una catComp
	 * @param catComp La catComp con los nuevos datos, el id ha de ser el de la catComp a actualizar
	 * @returns `true` si se ha actualizado `false caso contrario`
	 * @throws {Error}
	 */
	@Put('')
	async updateCompt(@Body() catComp: CatComp): Promise<boolean> {
		const existingCompt = await this.catCompRepo.findOne({ id: catComp.id });
		if (!existingCompt) {
			throw new NotFoundException('No existe una competencia con ese id');
		}
		//? Preguntar a vega si se puede modificar una catComp si tiene alguna evaluación anterior o en curso
		// if (catComp.createdAt != undefined && catComp.descripcion === undefined) {
		// 	throw new UnprocessableEntityException('La descripción no ha de ser undefined y la fecha ha de ser undefined');
		// }
		this.catCompRepo.save(catComp);
		return true;
	}
}
