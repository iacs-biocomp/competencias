import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatCompRepo } from '../cat-comp/catComp.repository';
import { CatContrRepo } from '../cat-contract/catContr.repository';
import { TrabajadorRepo } from './trabajador.repository';
import { TrabajadoresController } from './trabajadores.controller';
import { TrabajadoresService } from './trabajadores.service';

@Module({
	imports: [TypeOrmModule.forFeature([TrabajadorRepo, CatCompRepo, CatContrRepo])],
	controllers: [TrabajadoresController],
	providers: [TrabajadoresService],
})
export class TrabajadoresModule {}
