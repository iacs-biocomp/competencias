import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEvaluacion, ITrabajador } from 'sharedInterfaces/Entity';
import { environment as cnf } from 'src/environments/environment';
import { IValoracionAddDTO, IValoracionSettedDTO, IValoracionUpdateDTO } from 'sharedInterfaces/DTO';

@Injectable({ providedIn: 'root' })
export class ValoracionesService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * @param worker the worker to search
	 * @param evId Evaluation id
	 * @returns Valorations that user has already setted for certain `worker` on a `ev`
	 */
	async getUsrEvVals(
		worker: ITrabajador | ITrabajador['dni'],
		evId: IEvaluacion['id'],
	): Promise<IValoracionSettedDTO[]> {
		const dni = typeof worker === 'string' ? worker : worker.dni;
		//LOG: httpGet obteniendo evaluaciones del usuario ${dni} con evId ${evId} apiUrlReq=${apiUrlReq}
		return this.httpClient
			.get<IValoracionSettedDTO[]>(`${cnf.apiURL}/valoraciones/${dni}/${evId}`)
			.toPromise();
	}

	/**
	 * Add a new valoracion to the ddbb, the backend searches if a valoracion with that comp and comport exists,
	 * if so, it does NOT make changes and throws and exception. To update use {@link update}
	 *
	 * @param val The valoracion without the ID with comp, comport and puntuacion
	 * @returns A `Promise` that it's `true` if it has been added, exception if not
	 * @throws exception if the valoracion has not been found
	 */
	async add(val: IValoracionAddDTO): Promise<boolean> {
		//LOG: httpPost a ${apiUrlReq} añadiendo valoracion ${val}
		return this.httpClient.post<boolean>(`${cnf.apiURL}/valoraciones`, val).toPromise();
	}

	/**
	 * Update the puntacion of a valoracion already created
	 * @param val The valoracion to update
	 * @returns A `Promise` that it's `true` if it has been updated, exception if not
	 * @throws exception if the valoracion has not been found
	 *
	 */
	async update(val: IValoracionUpdateDTO): Promise<boolean> {
		//LOG: httpPut a ${apiUrlReq} cambiando valoración ${val}
		return this.httpClient.put<boolean>(`${cnf.apiURL}/valoraciones`, val).toPromise();
	}
}
