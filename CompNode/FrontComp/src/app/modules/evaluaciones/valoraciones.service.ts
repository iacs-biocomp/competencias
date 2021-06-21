import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEvaluacion, ITrabajador, IValoracion } from 'sharedInterfaces/Entity';
import { environment as cnf } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ValoracionesService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * TODO: Tsdoc
	 * @param worker
	 * @param evId
	 * @returns
	 */
	async getUsrEvVals(worker: ITrabajador | ITrabajador['dni'], evId: IEvaluacion['id']) {
		const dni = typeof worker === 'string' ? worker : worker.dni;
		return this.httpClient.get<IValoracion[]>(`${cnf.apiURL}/valoraciones/${dni}/${evId}`).toPromise();
	}
}
