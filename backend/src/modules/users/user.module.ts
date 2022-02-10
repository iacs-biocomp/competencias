import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserService } from './services/user.service';
import { AuthModule } from '../auth/auth.module';
import { RoleRepository } from '../role/role.repository';
import { UserController } from './controllers/user.controller';

@Module({
	imports: [TypeOrmModule.forFeature([UserRepository, RoleRepository]), AuthModule],
	providers: [UserService],
	controllers: [UserController],
})
export class UserModule {}
