import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatCompRepo } from '../cat-comp/catComp.repository';
import { ModelosController } from './modelos.controller';
import { EvModelRepo } from './modelos.repository';
import { SubModelRepo } from './subModel.repository';

@Module({
	imports: [TypeOrmModule.forFeature([EvModelRepo, CatCompRepo, SubModelRepo])],
	controllers: [ModelosController],
})
export class ModelosModule {}
