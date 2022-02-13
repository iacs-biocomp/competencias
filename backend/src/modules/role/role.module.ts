import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';

@Module({
	imports: [TypeOrmModule.forFeature([RoleRepository])],
	providers: [RoleService],
	controllers: [RoleController],
})
export class RoleModule {}
