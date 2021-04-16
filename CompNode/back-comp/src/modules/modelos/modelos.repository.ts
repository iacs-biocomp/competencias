import { EvModel } from 'src/entity/EvModel.entity';
import { Repository, EntityRepository } from 'typeorm';
import { Ev } from '../../entity/Ev.entity';

@EntityRepository(EvModel)
export class EvModelRepo extends Repository<EvModel> {}
