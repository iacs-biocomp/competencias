import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodosRepo } from '../trabajadores/periodos.repository';
import { TrabajadorRepo } from '../trabajadores/trabajador.repository';
import { UserRepository } from '../users/user.repository';
import { OrganigramaController } from './organigrama.controller';

@Module({
	imports: [TypeOrmModule.forFeature([TrabajadorRepo, UserRepository, PeriodosRepo])],
	controllers: [OrganigramaController],
})
export class OrganigramaModule {}
