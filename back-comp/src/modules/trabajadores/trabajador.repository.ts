import { Trabajador } from 'src/entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Trabajador)
export class TrabajadorRepo extends Repository<Trabajador> {}
