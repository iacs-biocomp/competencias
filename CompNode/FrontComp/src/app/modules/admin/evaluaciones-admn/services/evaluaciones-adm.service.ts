import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as cnf } from 'src/environments/environment';
import { IEvaluacion, IEvModel } from '../../../../../../../interfaces/IEvaluaciones';

/** Tiene todos los metodos necesarios para la administración de las Evaluaciones y Modelos */
@Injectable({ providedIn: 'root' })
export class EvaluacionesAdmService {
	constructor(private httpClient: HttpClient) {}
	/** Obtiene todas las evaluaciones del backend */
	public async getAll(): Promise<IEvaluacion[]> {
		return await this.httpClient.get<IEvaluacion[]>(`${cnf.apiURL}/evaluaciones`).toPromise();
	}

	// TODO: Tsdoc
	async deleteById(id: number): Promise<boolean> {
		var borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/evaluaciones/${id}`).toPromise();
		} catch (error) {
			console.log(error);
			alert('No se ha podido borrar esa evaluación, contacte con un administrador.');
		}
		return borrado;
	}

	// TODO: Tsdoc
	save(evalu: IEvaluacion): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/evaluaciones`, evalu).toPromise();
	}

	// TODO: Tsdoc
	editEval(evalu: IEvaluacion): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/evaluaciones`, evalu).toPromise();
	}
	/**
	 *
	 * @param catComp El identificador de la cat comp como string
	 * @returns Un array de los evModels que tiene una cat competencial
	 */
	getEvModels(catComp: string): Promise<IEvModel[]> {
		return this.httpClient.get<IEvModel[]>(`${cnf.apiURL}/modelos/${catComp}`).toPromise();
	}
	/**
	 * @returns Un array de todos los modelos de evaluaciones disponibles, independientemente de para que catComp sean
	 */
	getAllEvModels(): Promise<IEvModel[]> {
		return this.httpClient.get<IEvModel[]>(`${cnf.apiURL}/modelos`).toPromise();
	}
}
