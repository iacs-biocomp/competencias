import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from '../../../../../environments/environment';
import { ICompetencia } from '../../../../../../../interfaces/IEvaluaciones';

@Injectable({	providedIn: 'root'})
export class CompetenciasService {
	constructor(private httpClient: HttpClient) {}

	async delete(compet: ICompetencia): Promise<boolean> {
		await this.httpClient
			.delete(`${cnf.apiURL}/competencia/${compet.id}`)
			.toPromise();
		return true;
	}

	/**
	 * Metodo que obtiene todas las competencias del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todas las competencias
	 */
	public getAllCompt(): Promise<ICompetencia[]> {
		return this.httpClient
			.get<ICompetencia[]>(`${cnf.apiURL}/competencias/all`)
			.toPromise();
	}

	/**
	 * Metodo que borra una competencia del backend
	 *
	 * @returns Una promesa que es `True` si se ha borrado `False` en caso contrario
	 */
	async borrarCompeten(id: string): Promise<boolean> {
		var borrado = false;
		try {
			borrado = await this.httpClient
				.delete<boolean>(`${cnf.apiURL}/competencias/${id}`)
				.toPromise();
		} catch (error) {
			console.log(error);
			alert(
				'No se ha podido borrar esa competencia, contacte con un administrador.'
			);
		}
		return borrado;
	}

	/** POST: add a new competencia to the server */
	addCompeten(comp: ICompetencia): Promise<boolean> {
		return this.httpClient
			.post<boolean>(`${cnf.apiURL}/competencias`, comp)
			.toPromise();
	}
}
