import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as cnf } from '../../../../../environments/environment';
import { ICompetencia, IEvaluacion, ISubModel } from '../../../../../../../interfaces/IEvaluaciones'
import { ICatComp } from '../../../../../../../interfaces/ICategorias';

@Injectable({ providedIn: 'root'})
export class ModelosService {
  constructor(private httpClient: HttpClient) {}

	/**
	 * Metodo que obtiene todas las categorias competenciales del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todas las categorias competenciales
	 */
	 public async getAllCatComp(): Promise<ICatComp[]> {
		return await this.httpClient.get<ICatComp[]>(`${cnf.apiURL}/catcomp/all`).toPromise();
	}

	public async getAllCompeten(): Promise<ICompetencia[]> {
		return await this.httpClient.get<ICompetencia[]>(`${cnf.apiURL}/competencias/all`).toPromise();
	}

	public async getAllSubModel(): Promise<ISubModel[]> {
		return await this.httpClient.get<ISubModel[]>(`${cnf.apiURL}/subModel/all`).toPromise();
	}





}
