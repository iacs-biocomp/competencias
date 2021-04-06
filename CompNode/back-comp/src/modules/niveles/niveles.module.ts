import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NivelRepository } from './nivel.repository';
import { NivelesController } from './niveles.controller';

@Module({
	imports: [TypeOrmModule.forFeature([NivelRepository])],
	controllers: [NivelesController],
})
export class NivelesModule {}
