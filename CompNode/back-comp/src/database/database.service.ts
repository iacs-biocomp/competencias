import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { ConnectionOptions } from 'typeorm';
import { Configuration as cnf } from '../config/config.keys';

export const databaseProviders = [
	TypeOrmModule.forRootAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		async useFactory(config: ConfigService) {
			return {
				type: 'postgres' as 'postgres',
				host: config.get(cnf.HOST),
				username: config.get(cnf.USERNAME),
				port: Number(config.get(cnf.DBPORT)),
				database: config.get(cnf.DATABASE),
				password: config.get(cnf.PASSWORD),
				entities: [__dirname + '/../**/*.entity{.ts,.js}'],
				migrations: [__dirname + '/migrations/*{.ts,.js}'],
				logging: false,
			} as ConnectionOptions;
		},
	}),
];
