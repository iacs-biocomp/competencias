import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatContractController } from './cat-contract.controller';
import { CatContrRepo } from './catContr.repository';

@Module({
	imports: [TypeOrmModule.forFeature([CatContrRepo])],
	controllers: [CatContractController],
})
export class CatContractModule {}
