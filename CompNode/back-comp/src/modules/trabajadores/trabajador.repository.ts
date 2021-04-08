import { Trabajador } from 'src/entity/Trabajador.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Trabajador)
export class TrabajadorRepo extends Repository<Trabajador> {}
