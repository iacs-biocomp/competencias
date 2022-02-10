import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrganigramaTrabajadorDTO } from 'sharedInterfaces/DTO/organigrama.DTO';
import { JwtService } from 'src/app/services/auth/jwt.service';
import { environment as cnf } from 'src/environments/environment';
import { LogService } from 'src/app/shared/log/log.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class UsrOrganigramaService {
	constructor(
		private httpClient: HttpClient,
		private jwtSv: JwtService,
		private readonly logger: LogService,
	) {}

	/**
	 * Fetch the user organization chart from the API
	 *
	 * @returns The user organization chart type {@link IOrganigramaTrabajadorDTO}
	 */
	organigramaUsr(): Promise<IOrganigramaTrabajadorDTO> {
		const token = this.jwtSv.getDecodedToken();
		if (!token) {
			const msg = 'Not token provided from jwtSv';
			const err = new Error(msg);
			this.logger.error(msg, err);
			throw err;
		}
		const url = `${cnf.API_URL}/organigrama/${token.username}`;
		this.logger.debug(`Get req a ${url}, obteniendo mi organigrama`);
		return firstValueFrom(this.httpClient.get<IOrganigramaTrabajadorDTO>(url));
	}
}
