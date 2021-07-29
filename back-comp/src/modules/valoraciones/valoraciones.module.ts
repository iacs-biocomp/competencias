import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValoracionesController } from './controllers/valoraciones.controller';
import { ValoracionesService } from './services/valoraciones.service';
import { ValoracionesRepo } from './valoraciones.repository';

@Module({
	imports: [TypeOrmModule.forFeature([ValoracionesRepo])],
	controllers: [ValoracionesController],
	providers: [ValoracionesService],
})
export class ValoracionesModule {}
