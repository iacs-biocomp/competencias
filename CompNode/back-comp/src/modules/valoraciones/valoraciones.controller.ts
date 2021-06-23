import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IValoracionToAddDTO } from 'sharedInterfaces/DTO';
import { IValoracion } from 'sharedInterfaces/Entity';
import { Valoracion } from 'src/entity';
import { ValoracionesRepo } from './valoraciones.repository';

@Controller('nest/valoraciones')
export class ValoracionesController {
	constructor(@InjectRepository(ValoracionesRepo) private readonly valRepo: ValoracionesRepo) {}

	@Get(':dni')
	async getAllValsOfUsr(@Param('dni') dni: string): Promise<Valoracion[]> {
		return this.valRepo.find({ where: { evaluado: { dni: dni } }, relations: ['evaluado', 'evaluador'] });
	}

	/**
	 *
	 * @param dni El dni del trabajador del cual se quieren obtener las valoraciones
	 * @param evId El identificador de la evaluación
	 * @returns Las valoraciones de ese trabajador en esa evaluación
	 */
	@Get(':dni/:evId')
	async getUsrEvVals(@Param('dni') dni: string, @Param('evId') evId: number): Promise<Valoracion[]> {
		return this.valRepo.find({
			where: { evaluado: { dni: dni }, ev: { id: evId } },
			relations: ['evaluado', 'evaluador', 'ev', 'comport', 'comp'],
		});
	}

	/**
	 * Guarda una nueva valoración en la DB
	 * @param val La valoración sin identificador a guardar en la DB
	 * @returns `true` en caso de que se haya guardado correctamente la valoración `false` o Excepción en caso contrario
	 */
	@Post('')
	async createVal(@Body() val: IValoracionToAddDTO): Promise<boolean> {
		console.log(val);
		const existentVal = await this.valRepo.findOne({
			where: { ev: { id: val.ev.id }, comp: { id: val.comp.id }, comport: { id: val.comport.id } },
		});
		if (!!existentVal) {
			throw new BadRequestException(
				'La valoración que se quiere crear ya existe, para actualizar realizar petición a endpoint PUT',
			);
		}
		await this.valRepo.save(val);
		return true;
	}

	/**
	 * Actualiza una valoración en la DB
	 * @param val La valoración con el identificador
	 * @returns `true` en caso de que se haya actualizado correctamente la valoración `false` o Excepción en caso contrario
	 */
	@Put('')
	async editVal(@Body() val: IValoracion): Promise<boolean> {
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
