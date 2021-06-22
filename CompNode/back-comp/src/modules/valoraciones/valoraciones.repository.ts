import { Valoracion } from 'src/entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Valoracion)
export class ValoracionesRepo extends Repository<Valoracion> {}
