import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from '../../../../../environments/environment';
import { ITrabajadorDTO } from '../../../../../../../interfaces/DTO/ITrabajadorDTO';
import { ICatComp, ICatContr } from '../../../../../../../interfaces/ICategorias';

@Injectable({
	providedIn: 'root',
})
export class TrabajadoresService {
	constructor(private httpClient: HttpClient) {}

	delete(worker: ITrabajadorDTO): Promise<boolean> {
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/trabajadores/${worker.dni}`).toPromise();
	}

	/**
	 * Metodo que obtiene todas los trabajadores del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todos los trabajadores
	 */
	public getAllTrabajadores(): Promise<ITrabajadorDTO[]> {
		return this.httpClient.get<ITrabajadorDTO[]>(`${cnf.apiURL}/trabajadores/all`).toPromise();
	}

	/**
	 * Metodo que borra un worker del backend
	 *
	 * @returns Una promesa que es `True` si se ha borrado `False` en caso contrario
	 */
	async borrarTrabajador(id: string): Promise<boolean> {
		var borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/trabajadores/${id}`).toPromise();
		} catch (error) {
			console.log(error);
			//TODO: Excepción si hay error lanzar a controlador (Componente)
			alert('No se ha podido borrar ese worker, contacte con un administrador.');
		}
		return borrado;
	}

	/** POST: add a new worker to the server */
	addTrabajador(worker: ITrabajadorDTO): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/trabajadores`, worker).toPromise();
	}
	/**
	 *
	 * @param comp El worker a editar en la base de datos
	 * @returns Una promesa que es `True` si se ha editado `False` en caso contrario
	 */
	editTrabajador(worker: ITrabajadorDTO): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/trabajadores`, worker).toPromise();
	}

	public getAllCatComp(): Promise<ICatComp[]> {
		return this.httpClient.get<ICatComp[]>(`${cnf.apiURL}/catcomp/all`).toPromise();
	}

	public getAllCatContrac(): Promise<ICatContr[]> {
		return this.httpClient.get<ICatContr[]>(`${cnf.apiURL}/catcontr/all`).toPromise();
	}
}
