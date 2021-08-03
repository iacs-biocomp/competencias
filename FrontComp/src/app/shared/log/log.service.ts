import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { IFrontLoggingPayload } from 'sharedInterfaces/DTO';

interface LogMessage extends IFrontLoggingPayload {}

@Injectable({ providedIn: 'root' })
export class LogService {
	static loggingSub?: Subscription;
	static latestMessages: LogMessage[] = [];
	static logToConsole = false;
	constructor(private readonly httpClient: HttpClient) {
		LogService.latestMessages = [{ msg: 'hola', date: new Date(), obj: {}, error: new Error('') }];
		setTimeout(() => {
			LogService.loggingSub = !LogService.loggingSub
				? window.logging?.subscribe((isLogging: boolean) => {
						LogService.logToConsole = isLogging;
						if (isLogging) {
							LogService.latestMessages.forEach(message => this.msgToConsole(message));
						}
				  })
				: LogService.loggingSub;
		}, 200);
		setTimeout(() => {
			this.log('nuevo mensaje', { id: 'C1' }, { id: 'Co1' });
			this.log('holaqtal', new Error(''));
		}, 3000);
		setTimeout(() => {
			this.log('nuevo 6s mensaje');
		}, 6000);
	}

	log(msg: string, ...args: any[]): void;
	log(msg: string, ...args: unknown[]): void {
		if (typeof args !== 'undefined') {
			LogService.latestMessages.push({ msg: msg, date: new Date(), ...args });
			// params.forEach(param => LogService.latestMessages.push({ msg: msg, date: new Date(), param }));
			if (LogService.logToConsole) {
				console.log(msg, ...args);
			}
		} else {
			LogService.latestMessages.push({ msg: msg, date: new Date() });
			if (LogService.logToConsole) {
				console.log(msg);
			}
		}
		// TODO: Obligatorio o recomendable mandar error T extends Error (Java) mirar en ts. en logger.error para mandar stacktrace a backend
	}
	private msgToConsole(msg: LogMessage) {
		const msgKeys = Object.keys(msg) as (keyof LogMessage)[];
		const params = msgKeys
			.map(key => {
				return key !== 'msg' && key !== 'date' ? msg[key] : undefined;
			})
			.filter(p => p !== undefined);
		console.log(msg.msg, ...params);
	}
}
