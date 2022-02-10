import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { LogService } from './log.service';

/**
 * @docsNotRequired
 */
export const LOGGER_FORROOT_GUARD = new InjectionToken<void>('LOGGER_FORROOT_GUARD');
//TODO: Tsdoc (Loguea a consola, backend en json o las dos)
export type LoggerType0_0_1 = 'CONSOLE' | 'JSON' | 'CONSOLE&JSON';

//TODO: TSdoc
export enum LoggerLevel0_0_1 {
	TRACE = 7,
	DEBUG = 6,
	INFO = 5,
	LOG = 4,
	WARN = 3,
	ERROR = 2,
	FATAL = 1,
	OFF = 0,
}
/**
 * Tipo en versión alpha
 * Deprecado en poco tiempo, usar solo para pruebas, tiene la configuración del logger
 */
export type LogginOptions0_0_1 = {
	// TODO: TSdoc
	level: LoggerLevel0_0_1;
	/** Tiempo que espera el frontal para mandar un json
	 * con los mensajes que se han generado desde el envío previo */
	timeToSendToBackend: number;
	/** Comportamiento del logger, si imprime los mensajes por consola o los manda o ambos */
	loggerType: LoggerType0_0_1;
};

@NgModule({ declarations: [] })
export class LoggerModule {
	/** Singleton used for */
	private static moduleRef: LoggerModule | undefined;
	options!: LogginOptions0_0_1;
	constructor() {}
	static forRoot(options: LogginOptions0_0_1): ModuleWithProviders<LoggerModule> {
		const loggerModule = {
			ngModule: LoggerModule,
			providers: [LogService],
			options,
		};
		forRootGuard(LoggerModule.moduleRef);
		LoggerModule.moduleRef = loggerModule;
		return loggerModule;
	}
}

function forRootGuard(moduleRef: LoggerModule | undefined): string {
	if (!!moduleRef) {
		throw new Error(
			`LoggerModule.forRoot() called twice. Lazy loaded modules should use LoggerModule.forChild() instead.`,
		);
	}
	return 'guarded';
}
