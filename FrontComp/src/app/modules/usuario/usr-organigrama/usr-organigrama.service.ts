import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrganigramaTrabajadorDTO } from 'sharedInterfaces/DTO/organigrama.DTO';
import { JwtService } from 'src/app/services/auth/jwt.service';
import { environment as cnf } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class UsrOrganigramaService {
	constructor(private httpClient: HttpClient, private jwtSv: JwtService) {}

	/**
	 * Fetch the user organization chart from the API
	 * @returns The user organization chart type {@link IOrganigramaTrabajadorDTO}
	 */
	organigramaUsr(): Promise<IOrganigramaTrabajadorDTO> {
		const token = this.jwtSv.getDecodedToken();
		return this.httpClient
			.get<IOrganigramaTrabajadorDTO>(`${cnf.apiURL}/organigrama/${token.username}`)
			.toPromise();
	}
}
