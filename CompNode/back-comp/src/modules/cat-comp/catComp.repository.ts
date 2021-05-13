import { CatComp } from 'src/entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(CatComp)
export class CatCompRepo extends Repository<CatComp> {}
