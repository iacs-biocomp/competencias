import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { IComportamiento } from 'sharedInterfaces/Entity';
import { IComportAddDTO, IComportGetDTO } from 'sharedInterfaces/DTO';
import { Comportamiento } from '../../../../../../../back-comp/src/entity';

@Injectable({ providedIn: 'root' })
export class ComportService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * Metodo que obtiene todas los comportamientos del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todos los comportamientos
	 * TODO: DTO return type
	 */
	public getAll(): Promise<IComportamiento[]> {
		return this.httpClient.get<IComportamiento[]>(`${cnf.apiURL}/comportamientos/all`).toPromise();
	}

	/**
	 * Metodo que borra una comportamiento del backend
	 *
	 * @throws Exception de tipo http con el codigo de error, si el comportamiento no se ha podido borrar
	 * @returns Una promesa que es `True` si se ha borrado `False` en caso contrario
	 * TODO: DTO param type
	 *
	 */
	async delete(comport: Comportamiento['id'] | Pick<Comportamiento, 'id'>): Promise<boolean> {
		const id = typeof comport === 'string' ? comport : comport.id;
		let borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/comportamientos/${id}`).toPromise();
		} catch (error) {
			console.log(error);
			alert('No se ha podido borrar ese comportamiento, contacte con un administrador.');
		}
		return borrado;
	}

	/**
	 * Añade un comportamiento a la base de datos
	 *
	 * @throws Exception de tipo http si no se ha podido añadir el comportamiento.
	 * @param comp El comportamiento a añadir
	 * @returns Una promesa que se resuelve como `true` si se ha añadido correctamente y `false` en caso contrario
	 * TODO: DTO param type
	 *
	 */
	add(comp: IComportAddDTO): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/comportamientos`, comp).toPromise();
	}

	/**
	 *
	 * @param comport El comportamiento a editar en la base de datos
	 * @returns Una promesa que es `True` si se ha editado `False` en caso contrario
	 * TODO: DTO param type
	 *
	 */
	edit(comport: IComportAddDTO): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/comportamientos`, comport).toPromise();
	}
}
