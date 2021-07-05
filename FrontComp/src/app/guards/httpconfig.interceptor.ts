import { Injectable } from '@angular/core';
import {
	HttpInterceptor,
	HttpRequest,
	HttpResponse,
	HttpHandler,
	HttpEvent,
	HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment as cnf } from 'src/environments/environment';
@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
	constructor() {}
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		console.log('Interceptor');
		const token: string = localStorage.getItem(cnf.jwtName)!;

		if (token) {
			request = request.clone({
				headers: request.headers.set('Authorization', 'Bearer ' + token),
			});
		}

		if (!request.headers.has('Content-Type')) {
			request = request.clone({
				headers: request.headers.set('Content-Type', 'application/json'),
			});
		}

		request = request.clone({
			headers: request.headers.set('Accept', 'application/json'),
		});

		return next.handle(request).pipe(
			map((event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {
					console.log('event--->>>', event);
					// this.errorDialogService.openDialog(event);
				}
				return event;
			}),
			catchError((error: HttpErrorResponse) => {
				let data = {};
				data = {
					reason: error && error.error && error.error.reason ? error.error.reason : '',
					status: error.status,
				};
				console.log(data);
				return throwError(error);
			}),
		);
	}
}
