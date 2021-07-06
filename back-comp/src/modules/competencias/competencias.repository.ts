import { Competencia } from 'src/entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Competencia)
export class ComptRepository extends Repository<Competencia> {}
