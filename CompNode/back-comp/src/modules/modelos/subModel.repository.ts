import { SubModel } from 'src/entity/SubModel.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(SubModel)
export class SubModelRepo extends Repository<SubModel> {}
