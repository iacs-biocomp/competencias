import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatCompRepo } from '../cat-comp/catComp.repository';
import { PeriodosRepo } from '../trabajadores/periodos.repository';
import { CatContractController } from './cat-contract.controller';
import { CatContrRepo } from './catContr.repository';

@Module({
	imports: [TypeOrmModule.forFeature([CatContrRepo, PeriodosRepo, CatCompRepo])],
	controllers: [CatContractController],
})
export class CatContractModule {}
