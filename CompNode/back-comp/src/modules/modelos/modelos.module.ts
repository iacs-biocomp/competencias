import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatCompRepo } from '../cat-comp/catComp.repository';
import { ModelosController } from './modelos.controller';
import { EvModelRepo } from './modelos.repository';

@Module({
	imports: [TypeOrmModule.forFeature([EvModelRepo, CatCompRepo])],
	controllers: [ModelosController],
})
export class ModelosModule {}
