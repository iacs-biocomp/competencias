import { Ev } from 'src/entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Ev)
export class EvRepository extends Repository<Ev> {}
