import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodosRepo } from '../trabajadores/periodos.repository';
import { CatContractController } from './cat-contract.controller';
import { CatContrRepo } from './catContr.repository';

@Module({
	imports: [TypeOrmModule.forFeature([CatContrRepo, PeriodosRepo])],
	controllers: [CatContractController],
})
export class CatContractModule {}
