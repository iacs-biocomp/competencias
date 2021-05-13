import { Comportamiento } from 'src/entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Comportamiento)
export class ComportRepository extends Repository<Comportamiento> {}
