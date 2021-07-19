import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICompetencia } from 'sharedInterfaces/Entity';
import { CompetAddDTO } from 'sharedInterfaces/DTO';

@Injectable({ providedIn: 'root' })
export class CompetenciasService {
	constructor(private httpClient: HttpClient) {}

	public delete(compet: ICompetencia | ICompetencia['id']): Promise<boolean> {
		const id = typeof compet === 'string' ? compet : compet.id;
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/competencias/${id}`).toPromise();
	}

	/**
	 * Metodo que obtiene todas las competencias del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todas las competencias
	 */
	public getAll(): Promise<ICompetencia[]> {
		return this.httpClient.get<ICompetencia[]>(`${cnf.apiURL}/competencias/all`).toPromise();
	}

	/**
	 * Metodo que borra una competencia del backend
	 *
	 * @returns Una promesa que es `True` si se ha borrado `False` en caso contrario
	 */
	async borrarCompeten(id: string): Promise<boolean> {
		let borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/competencias/${id}`).toPromise();
		} catch (error) {
			console.log(error);
			alert('No se ha podido borrar esa competencia, contacte con un administrador.');
		}
		return borrado;
	}

	/** POST: add a new competencia to the server */
	addCompeten(comp: CompetAddDTO): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/competencias`, comp).toPromise();
	}
	/**
	 *
	 * @param comp La competencia a editar en la base de datos
	 * @returns Una promesa que es `True` si se ha editado `False` en caso contrario
	 */
	editCompt(comp: ICompetencia): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/competencias`, comp).toPromise();
	}
}
