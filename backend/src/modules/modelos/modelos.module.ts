import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatCompRepo } from '../cat-comp/catComp.repository';
import { ModelosController } from './controllers/modelos.controller';
import { EvModelRepo } from './modelos.repository';
import { ModelosService } from './services/modelos.service';
import { SubModelRepo } from './subModel.repository';

@Module({
	imports: [TypeOrmModule.forFeature([EvModelRepo, CatCompRepo, SubModelRepo])],
	controllers: [ModelosController],
	providers: [ModelosService],
})
export class ModelosModule {}
