import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as cnf } from 'src/environments/environment';
import { IEvaluacion, IEvModel } from '../../../../../../../interfaces/IEvaluaciones';
import { evAddDTO } from '../new-ev-modal/new-ev-modal.component';

/** Tiene todos los metodos necesarios para la administración de las Evaluaciones y Modelos */
@Injectable({ providedIn: 'root' })
export class EvaluacionesAdmService {
	constructor(private httpClient: HttpClient) {}
	/**
	 * @returns Una promsesa que se resuelve como un array de todas las evaluaciones que tiene el backend
	 */
	public async getAll(): Promise<IEvaluacion[]> {
		return await this.httpClient.get<IEvaluacion[]>(`${cnf.apiURL}/evaluaciones`).toPromise();
	}

	// TODO: Tsdoc
	deleteById(id: number): Promise<boolean> {
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/evaluaciones/${id}`).toPromise();
	}

	// TODO: Tsdoc
	save(evalu: evAddDTO): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/evaluaciones`, evalu).toPromise();
	}

	// TODO: Tsdoc
	editEval(evalu: IEvaluacion): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/evaluaciones`, evalu).toPromise();
	}
}
