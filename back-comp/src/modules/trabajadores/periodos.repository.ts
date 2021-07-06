import { PeriodoTrab } from 'src/entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(PeriodoTrab)
export class PeriodosRepo extends Repository<PeriodoTrab> {}
