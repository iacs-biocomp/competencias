import { Repository, EntityRepository } from 'typeorm';
import { Ev } from '../../entity/Ev.entity';

@EntityRepository(Ev)
export class EvRepository extends Repository<Ev> {}
