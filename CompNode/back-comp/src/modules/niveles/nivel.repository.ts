import { Nivel } from 'src/entity/Nivel.entity';
import { Repository, EntityRepository } from 'typeorm';
import { Comportamiento } from '../../entity/Comportamiento.entity';

@EntityRepository(Nivel)
export class NivelRepository extends Repository<Nivel> {}
