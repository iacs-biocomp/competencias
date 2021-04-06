import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComportamientosController } from './comportamientos.controller';
import { ComportRepository } from './comportamientos.repository';

@Module({
	imports: [TypeOrmModule.forFeature([ComportRepository])],
	controllers: [ComportamientosController],
})
export class ComportamientosModule {}
