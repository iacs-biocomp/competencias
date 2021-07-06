import { Nivel } from 'src/entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Nivel)
export class NivelRepository extends Repository<Nivel> {}
