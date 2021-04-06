import { Repository, EntityRepository } from 'typeorm';
import { Comportamiento } from '../../entity/Comportamiento.entity';

@EntityRepository(Comportamiento)
export class ComportRepository extends Repository<Comportamiento> {}
