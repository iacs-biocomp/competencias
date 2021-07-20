import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrganigramaTrabajador, IOrganigramaTrabajadorDTO } from 'sharedInterfaces/Entity';
import { JwtService } from 'src/app/services/auth/jwt.service';
import { environment as cnf } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class UsrOrganigramaService {
	constructor(private httpClient: HttpClient, private jwtSv: JwtService) {}

	/**
	 * TODO: DTO return type
	 * Fetch the user organization chart from the API
	 * @returns The user organization chart type {@link IOrganigramaTrabajador}
	 *
	 *
	 */
	organigramaUsr(): Promise<IOrganigramaTrabajadorDTO> {
		const token = this.jwtSv.getDecodedToken();
		return this.httpClient
			.get<IOrganigramaTrabajador>(`${cnf.apiURL}/organigrama/${token.username}`)
			.toPromise();
	}
}
