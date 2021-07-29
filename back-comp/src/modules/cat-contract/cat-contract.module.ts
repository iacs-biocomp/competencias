import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatCompRepo } from '../cat-comp/catComp.repository';
import { PeriodosRepo } from '../trabajadores/periodos.repository';
import { CatContrRepo } from './catContr.repository';
import { CatContractController } from './controllers/cat-contract.controller';
import { CatContractService } from './services/cat-contract.service';

@Module({
	imports: [TypeOrmModule.forFeature([CatContrRepo, PeriodosRepo, CatCompRepo])],
	controllers: [CatContractController],
	providers: [CatContractService],
})
export class CatContractModule {}
