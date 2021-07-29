import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '../../config/config.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../config/config.module';
import { Configuration as cnfKeys } from '../../config/config.keys';
import { UserRepository } from '../users/user.repository';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserRepository]),
		PassportModule.register({
			defaultStrategy: 'jwt',
		}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory(cnfSv: ConfigService) {
				return {
					secret: cnfSv.get(cnfKeys.JWT_SECRET),
					signOptions: {
						expiresIn: parseInt(cnfSv.get(cnfKeys.JWT_EXPIRETIME)),
					},
				};
			},
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, ConfigService],
	exports: [PassportModule],
})
export class AuthModule {}
