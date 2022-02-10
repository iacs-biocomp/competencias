import { Inject, Injectable, Logger, Scope, ValueProvider } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService {
	//como inyectar valores a un servicio: https://is.gd/udht5A
	/**
	 * TODO: Tsdoc, usar esta función para configurar el servicio.
	 * @param cnfObj
	 * @returns
	 */
	static configure(cnfObj: { context: string }): [ValueProvider<string>, typeof LoggingService] {
		return [{ provide: 'logger_context', useValue: cnfObj.context }, LoggingService];
	}

	/** Nest default logger */
	private readonly nLogger: Logger;
	constructor(@Inject('logger_context') context: string) {
		this.nLogger = new Logger(context);
	}

	// Ver mas de method overloading in typescript, o hacer con parametros opcionales como siempre https://is.gd/Ts1MBh
	error(message: any, stack?: string, context?: string): void;
	error(message: any, ...optionalParams: [...any, string?, string?]): void {
		this.nLogger.error(message);
	}

	/**
	 * Write a 'log' level log.
	 */
	log(message: any, context?: string): void;
	log(message: any, ...optionalParams: [...any, string?]): void {
		this.nLogger.log(message);
	}

	/**
	 * Write a 'warn' level log.
	 */
	warn(message: any, context?: string): void;
	warn(message: any, ...optionalParams: [...any, string?]): void {
		this.nLogger.warn(message);
	}

	/**
	 * Write a 'debug' level log.
	 */
	debug(message: any, context?: string): void;
	debug(message: any, ...optionalParams: [...any, string?]): void {
		this.nLogger.debug(message);
	}

	/**
	 * Write a 'verbose' level log.
	 */
	verbose(message: any, context?: string): void;
	verbose(message: any, ...optionalParams: [...any, string?]): void {
		this.nLogger.verbose(message);
	}
}
