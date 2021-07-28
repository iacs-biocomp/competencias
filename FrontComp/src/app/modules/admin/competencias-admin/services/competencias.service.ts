import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICompAddDTO, ICompGetDTO } from 'sharedInterfaces/DTO';
import { Competencia } from '../../../../../../../back-comp/src/entity';

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
	 * TODO: DTO return type
	 *
	 */
	public getAll(): Promise<ICompGetDTO[]> {
		return this.httpClient.get<ICompGetDTO[]>(`${cnf.apiURL}/competencias/all`).toPromise();
	}

	/**
	 * Metodo que borra una competencia del backend
	 *
	 * @returns Una promesa que es `True` si se ha borrado `False` en caso contrario
	 */
	async borrarCompeten(id: string): Promise<boolean> {
	async delete(comp: Competencia['id'] | Pick<Competencia, 'id'>): Promise<boolean> {
		const compId = typeof comp === 'string' ? comp : comp.id;
		let borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/competencias/${compId}`).toPromise();
		} catch (error) {
			console.log(error);
			alert('No se ha podido borrar esa competencia, contacte con un administrador.');
		}
		return borrado;
	}

	/**
	 * POST: add a new competencia to the server
	 * TODO: DTO param type
	 *
	 */
	add(comp: ICompAddDTO): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/competencias`, comp).toPromise();
	}

	/**
	 *
	 * @param comp La competencia a editar en la base de datos
	 * @returns Una promesa que es `True` si se ha editado `False` en caso contrario
	 * TODO: DTO param type
	 *
	 */
	edit(comp: ICompAddDTO): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/competencias`, comp).toPromise();
	}
}
