import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { IOrganigramaTrabajador } from '../../../../../../interfaces/IOrganigrama';
import { environment as cnf } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class UsrOrganigramaService {
	constructor(private httpClient: HttpClient, private jwtSv: JwtService) {}
	organigramaUsr(): Promise<IOrganigramaTrabajador> {
		const token = this.jwtSv.getDecodedToken();
		return this.httpClient
			.get<IOrganigramaTrabajador>(`${cnf.apiURL}/organigrama/${token.username}`)
			.toPromise();
	}
}
