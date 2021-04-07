import { CatContr } from 'src/entity/CatContr.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(CatContr)
export class CatContrRepo extends Repository<CatContr> {}
