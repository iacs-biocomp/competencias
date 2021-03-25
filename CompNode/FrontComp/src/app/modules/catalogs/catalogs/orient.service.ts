import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICatalog } from './catalog.interface';
import { environment as cnf } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class OrientService {
	constructor(private httpClient: HttpClient) {}
	getPublicCatalogs(): Promise<ICatalog> {
		return this.httpClient.get<ICatalog>(cnf.apiURL + '/orient').toPromise();
	}
}
