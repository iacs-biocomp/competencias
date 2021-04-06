import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ICompetencia } from '../../../../../../../interfaces/IEvaluaciones';
import { environment as cnf } from '../../../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class CompetenciasService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * Metodo que obtiene todas las competencias del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todas las competencias
	 */
	public getAllCompt(): Promise<ICompetencia[]> {
		return this.httpClient
			.get<ICompetencia[]>(cnf.apiURL + `/competencias/all`)
			.toPromise();
	}

	async borrarCompt(id: string) {
		var borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/competencias/${id}`).toPromise();
		} catch (error) {
			console.log(error);
			alert(
				'No se ha podido borrar esa competencia, contacte con un administrador.'
			);
		}

		return borrado;
	}

	/** POST: add a new competencia to the server */
	addComp(comp: ICompetencia): Observable<ICompetencia> {
		return this.httpClient.post<ICompetencia>(
			(`${cnf.apiURL}/competencias`),
			comp
		);
	}
}
