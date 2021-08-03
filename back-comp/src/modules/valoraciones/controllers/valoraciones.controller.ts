import {
	BadRequestException,
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Roles } from 'sharedInterfaces/Entity';
import { ValoracionAddDTO, ValoracionUpdateDTO } from 'src/DTO';
import { Valoracion } from 'src/entity';
import { SetRoles } from 'src/modules/role/decorators/role.decorator';
import { ValoracionesRepo } from '../valoraciones.repository';

@Controller('nest/valoraciones')
export class ValoracionesController {
	constructor(
		@InjectRepository(ValoracionesRepo) private readonly valRepo: ValoracionesRepo, // private readonly jwtSv: JwtService, // @InjectRepository(ComptRepository) private readonly compRepo: ComptRepository, // @InjectRepository(ComportRepository) private readonly comportRepo: ComportRepository, // @InjectRepository(TrabajadorRepo) private readonly wrkRepo: TrabajadorRepo, // @InjectRepository(EvRepository) private readonly evRepo: EvRepository,
	) {}

	/**
	 *
	 * @param dni
	 * @returns
	 * @deprecated Rara vez se va a usar, el usuario no debería acceder a todas sus valoraciones
	 */
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
	async getUsrEvVals(@Param('dni') dni: string, @Param('evId', ParseIntPipe) evId: number): Promise<Valoracion[]> {
		//const token =  this.jwtSv.decode(cookies.token);
		// const trab = this.trabSv.findOne(tkn.user);
		// if (dni === trab.dni) {
		// }
		return this.valRepo.find({
			where: { evaluado: { dni: dni }, ev: { id: evId, isShowingResults: true } },
			relations: ['evaluado', 'evaluador', 'ev', 'comport', 'comp'],
		});
	}

	@Get('admin/:dni/:evId')
	@SetRoles(Roles.ADMIN, Roles.GESTOR)
	async adminGetUserEvVals(
		@Param('dni') dni: string,
		@Param('evId', ParseIntPipe) evId: number,
	): Promise<Valoracion[]> {
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
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	@UseGuards()
	async createVal(@Req() req: Request, @Body() val: ValoracionAddDTO): Promise<boolean> {
		const existentVal = await this.valRepo.findOne({
			where: { ev: { id: val.ev }, comp: { id: val.comp }, comport: { id: val.comport } },
		});
		if (!!existentVal) {
			throw new BadRequestException(
				'La valoración que se quiere crear ya existe, para actualizar realizar petición a endpoint PUT',
			);
		}
		// const [evaluador, evaluado, ev, comp, comport] = await Promise.all([
		// 	this.wrkRepo.findOne(val.evaluador, { cache: 20000 }),
		// 	this.wrkRepo.findOne(val.evaluado, { cache: 20000 }),
		// 	this.evRepo.findOne(val.evaluado, { cache: 20000 }),
		// 	this.compRepo.findOne(val.comp, { cache: 20000 }),
		// 	this.comportRepo.findOne(val.comport, { cache: 20000 }),
		// ]);
		await this.valRepo.save(val as unknown as Valoracion);
		return true;
	}

	/**
	 * Actualiza una valoración en la DB
	 * @param val La valoración con el identificador
	 * @returns `true` en caso de que se haya actualizado correctamente la valoración `false` o Excepción en caso contrario
	 */
	@Put('')
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	@SetRoles(Roles.PUBLIC)
	async editVal(@Body() val: ValoracionUpdateDTO): Promise<boolean> {
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
