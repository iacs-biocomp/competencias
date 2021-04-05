import { Repository, EntityRepository } from 'typeorm';
import { Competencia } from '../../entity/Competencia.entity';

@EntityRepository(Competencia)
export class ComptRepository extends Repository<Competencia> {}
