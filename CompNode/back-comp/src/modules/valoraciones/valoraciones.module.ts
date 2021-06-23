import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValoracionesController } from './valoraciones.controller';
import { ValoracionesRepo } from './valoraciones.repository';

@Module({
	imports: [TypeOrmModule.forFeature([ValoracionesRepo])],
	controllers: [ValoracionesController],
})
export class ValoracionesModule {}
