import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComportRepository } from './comportamientos.repository';
import { ComportamientosController } from './controllers/comportamientos.controller';
import { ComportamientosService } from './services/comportamientos.service';

@Module({
	imports: [TypeOrmModule.forFeature([ComportRepository])],
	controllers: [ComportamientosController],
	providers: [ComportamientosService],
})
export class ComportamientosModule {}
