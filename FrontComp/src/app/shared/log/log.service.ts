import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { IFrontLoggingPayload, LogLevels } from 'sharedInterfaces/DTO';
import { environment as cnf } from 'src/environments/environment';

interface LogMessage extends IFrontLoggingPayload {}
@Injectable({ providedIn: 'root' })
export class LogService {
	static loggingSub?: Subscription;
	static latestMessages: LogMessage[] = [];
	static levelToLog: LogLevels | null;
	constructor(private readonly httpClient: HttpClient) {
		// Inicialización del servicio (singleton actualmente)
		setTimeout(() => {
			LogService.loggingSub = !LogService.loggingSub
				? window.logging?.subscribe((levelToLog: LogLevels | null) => {
						LogService.levelToLog = levelToLog;
						LogService.latestMessages.forEach(message => this.msgToConsole(message));
				  })
				: LogService.loggingSub;
		}, 10);
		setInterval(() => Promise.resolve(this.sortMessagesByDate), 2500);
		this.timeOutPruebaMsg();
	}

	error(msg: string, ...args: unknown[]): void {
		this.methodExtraction(msg, LogLevels.ERROR, args);
	}

	warn(msg: string, ...args: unknown[]): void {
		this.methodExtraction(msg, LogLevels.WARN, args);
	}

	log(msg: string, ...args: unknown[]): void {
		this.methodExtraction(msg, LogLevels.LOG, args);
	}

	debug(msg: string, ...args: unknown[]): void {
		this.methodExtraction(msg, LogLevels.DEBUG, args);
	}

	verbose(msg: string, ...args: unknown[]): void {
		this.methodExtraction(msg, LogLevels.VERBOSE, args);
	}

	private methodExtraction(msg: string, level: LogLevels, ...args: unknown[]): void {
		this.purgeMessages();
		// TODO: reducir complejidad
		if (
			typeof args[0] === 'object' &&
			args[0] !== null &&
			typeof (args[0] as []).length === 'number' &&
			(args[0] as []).length !== 0
		) {
			const msgObj: LogMessage = { msg, date: new Date(), level, ...args };
			LogService.latestMessages.push(msgObj);
			if (LogService.levelToLog) {
				this.msgToConsole(msgObj);
			}
		} else {
			const msgObj: LogMessage = { msg, date: new Date(), level };
			LogService.latestMessages.push({ msg, date: new Date(), level });
			if (LogService.levelToLog) {
				console.log(msgObj);
			}
		}
	}

	/**
	 * Transform log message of type {@link LogMessage} to a console message, readable by developers
	 *
	 * @param msg Message to log to the console
	 */
	private msgToConsole(msg: IFrontLoggingPayload): void {
		if (this.shouldLog(msg.level)) {
			const msgKeys = Object.keys(msg) as (keyof LogMessage)[];
			const condition = (key: keyof LogMessage) => key !== 'msg' && key !== 'date' && key !== 'level';
			const params = msgKeys
				.map(key => {
					return condition(key) ? msg[key] : undefined;
				})
				.filter(p => p !== undefined);
			switch (msg.level) {
				case LogLevels.ERROR:
					console.error(msg.msg, ...params);
					break;
				case LogLevels.WARN:
					console.warn(msg.msg, ...params);
					break;
				case LogLevels.LOG:
					console.log(msg.msg, ...params);
					break;
				case LogLevels.DEBUG:
					console.debug(msg.msg, ...params);
					break;
				case LogLevels.VERBOSE:
					console.info(msg.msg, ...params);
					break;
			}
		}
	}

	/**
	 * @param level Should be level that a msg has
	 * @returns `true` if msg should be logged to console `false` otherwise
	 */
	private shouldLog(level: LogLevels): boolean {
		const condition = LogService.levelToLog !== null && LogService.levelToLog >= level;
		return condition ? true : false;
	}

	/**
	 * @version 0.0.1
	 */
	purgeMessages() {
		const msgs = LogService.latestMessages;
		const msgsToDelete = msgs.length - cnf.msgLoggerNumber;
		if (msgsToDelete > 0) {
			msgs.splice(msgsToDelete);
		}
	}

	sortMessagesByDate(): void {
		LogService.latestMessages.sort((a, b) => a.date.getTime() - b.date.getTime());
	}

	private async sendMsgsToBackend(): Promise<boolean> {
		try {
			await this.httpClient.post<true>(`${cnf.apiURL}/logging`, LogService.latestMessages).toPromise();
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * @deprecated Remover una vez esten bien puestos los logs ya que sirve solo de prueba
	 */
	private timeOutPruebaMsg(): void {
		setTimeout(() => {
			this.error('Mensaje de error', new Error(''));
			this.warn('Mensaje de alerta');
			this.log('Mensaje de log');
			this.debug(
				'Mensaje de debug con objeto',
				{ id: 1, name: 'USER' },
				{ id: 1, name: 'USER' },
				{ id: 1, name: 'USER' },
				[{ e: 'hola' }],
			);
			this.verbose('Mensaje verbose', { url: 'https://is.gd/anicci' });
		}, 3000);
		setTimeout(() => {
			this.log('nuevo 6s mensaje');
		}, 6000);
	}
}
