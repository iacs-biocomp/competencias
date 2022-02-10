import { Injectable } from '@nestjs/common';
import { parse } from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { Configuration } from './config.keys';

/**
 * @description Service for getting the env variables
 * @function `get` Return the env variable value as a `String`
 */
@Injectable()
export class ConfigService {
	private readonly envConfig: { [key: string]: string };

	constructor() {
		const envFilePath = __dirname + '/../../../../.env';
		//*Se sustituye por .env y se cambia el nombre en el proceso de dkbuild.sh
		// const isDevelopmentEnv = process.env.NODE_ENV !== 'production';
		// isDevelopmentEnv ? __dirname + '/../../.env'  : __dirname + '/../../.envProd';

		const existsPath = existsSync(envFilePath);

		if (!existsPath) {
			console.error('.env file does not exist');
			process.exitCode = 1;
		}
		this.envConfig = parse(readFileSync(envFilePath));
		for (const item in Configuration) {
			if (this.envConfig[Configuration[item]] === undefined) {
				console.warn(`La variable de entorno ${item} no existe en el archivo .env`);
			}
		}
	}

	/**
	 * Gets the requested env variable
	 * @param key The env var name
	 * @returns The env variable as string
	 */
	get(key: Configuration): string {
		return this.envConfig[key]!;
	}
}
