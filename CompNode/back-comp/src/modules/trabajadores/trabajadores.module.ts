import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrabajadorRepo } from './trabajador.repository';
import { TrabajadoresController } from './trabajadores.controller';

@Module({
	imports: [TypeOrmModule.forFeature([TrabajadorRepo])],
	controllers: [TrabajadoresController],
})
export class TrabajadoresModule {}
