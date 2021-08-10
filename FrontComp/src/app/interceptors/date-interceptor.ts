import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AngularDateHttpInterceptor implements HttpInterceptor {
	iso8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/;

	public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
			tap({
				next: (event: HttpEvent<any>) => {
					if (event instanceof HttpResponse) {
						const body = event.body;
						this.convertToDate(body);
					}
				},
			}),
		);
	}

	convertToDate(body: unknown) {
		if (typeof body === 'object' && body !== null) {
			const casted = body as { [key: string]: unknown };
			for (const key of Object.keys(casted)) {
				const value = casted[key];
				if (this.isIso8601(value)) {
					casted[key] = new Date(value);
				} else if (typeof value === 'object' && value !== null) {
					this.convertToDate(value);
				}
			}
		} else {
			return body;
		}
	}

	/**
	 * Test if param is JS_Date type stringified, does not fail on undefined | null.
	 * @param value Value to test
	 * @returns `true` if is JS_Date type stringified, `false` otherwise
	 */
	isIso8601(value: unknown): value is string {
		return typeof value === 'string' ? this.iso8601.test(value) : false;
	}
}
