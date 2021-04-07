import { CatComp } from 'src/entity/CatComp.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(CatComp)
export class CatCompRepo extends Repository<CatComp> {}
