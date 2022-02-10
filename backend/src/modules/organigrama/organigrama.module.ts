import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodosRepo } from '../trabajadores/periodos.repository';
import { TrabajadorRepo } from '../trabajadores/trabajador.repository';
import { UserRepository } from '../users/user.repository';
import { OrganigramaController } from './controllers/organigrama.controller';
import { OrganigramaService } from './services/organigrama.service';

@Module({
	imports: [TypeOrmModule.forFeature([TrabajadorRepo, UserRepository, PeriodosRepo])],
	controllers: [OrganigramaController],
	providers: [OrganigramaService],
})
export class OrganigramaModule {}
