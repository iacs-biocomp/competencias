import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
@Module({
	imports: [...databaseProviders],
	// ! Error al exportarlo en nestjs v8 pero funciona sin exportar https://is.gd/A94p5z
	// exports: [...databaseProviders],
})
export class DatabaseModule {}
