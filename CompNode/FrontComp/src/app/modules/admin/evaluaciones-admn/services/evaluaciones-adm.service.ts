import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as cnf } from 'src/environments/environment';
import { IEvaluacion } from '../../../../../../../interfaces/IEvaluaciones';

@Injectable({ providedIn: 'root'})
export class EvaluacionesAdmService {
  constructor(private httpClient: HttpClient) {}

	public async getAllEval(): Promise<IEvaluacion[]> {
		return await this.httpClient.get<IEvaluacion[]>(`${cnf.apiURL}/evaluaciones/all`).toPromise();
	}

	async borrarEval(id: number): Promise<boolean> {
		var borrado = false;
		try{
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/evaluaciones/${id}`).toPromise();
		} catch (error){
			console.log(error);
			alert('No se ha podido borrar esa evaluación, contacte con un administrador.');
		}
		return borrado;
	}

	addEval(evalu: IEvaluacion): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/evaluaciones`, evalu).toPromise();
	}

	editEval(evalu: IEvaluacion): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/evaluaciones`, evalu).toPromise();
	}
}
