import { CatContr } from 'src/entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(CatContr)
export class CatContrRepo extends Repository<CatContr> {}
