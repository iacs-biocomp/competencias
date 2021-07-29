import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NivelesController } from './controllers/niveles.controller';
import { NivelRepository } from './nivel.repository';
import { NivelesService } from './services/niveles.service';

@Module({
	imports: [TypeOrmModule.forFeature([NivelRepository])],
	controllers: [NivelesController],
	providers: [NivelesService],
})
export class NivelesModule {}
