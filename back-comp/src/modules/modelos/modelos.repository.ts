import { EvModel } from 'src/entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(EvModel)
export class EvModelRepo extends Repository<EvModel> {}
