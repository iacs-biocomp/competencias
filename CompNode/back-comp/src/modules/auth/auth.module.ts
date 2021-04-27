import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '../../config/config.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../config/config.module';
import { Configuration } from '../../config/config.keys';
import { UserRepository } from '../users/user.repository';

// TODO: JSDoc
@Module({
	imports: [
		TypeOrmModule.forFeature([UserRepository]),
		PassportModule.register({
			defaultStrategy: 'jwt',
		}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory(config: ConfigService) {
				return {
					secret: config.get(Configuration.JWT_SECRET),
					signOptions: {
						expiresIn: 600,
					},
				};
			},
		}),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		ConfigService,
		// JwtStrategy,
		// KeycloakService
	],
	exports: [/* JwtStrategy, */ PassportModule],
})
export class AuthModule {}
