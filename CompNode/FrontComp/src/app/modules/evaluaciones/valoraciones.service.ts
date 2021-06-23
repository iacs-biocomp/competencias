import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEvaluacion, ITrabajador, IValoracion } from 'sharedInterfaces/Entity';
import { environment as cnf } from 'src/environments/environment';
import { IValoracionToAddDTO } from 'sharedInterfaces/DTO';

@Injectable({ providedIn: 'root' })
export class ValoracionesService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * TODO: Tsdoc
	 * Obtiene una evaluacion indicando el id de la evaluacion y el dni del trabajador
	 * @param worker el trabajador a buscar
	 * @param evId el id de la evaluación
	 * @returns
	 */
	async getUsrEvVals(
		worker: ITrabajador | ITrabajador['dni'],
		evId: IEvaluacion['id'],
	): Promise<IValoracion[]> {
		const dni = typeof worker === 'string' ? worker : worker.dni;
		return this.httpClient.get<IValoracion[]>(`${cnf.apiURL}/valoraciones/${dni}/${evId}`).toPromise();
	}

	/**
	 * Añade una nueva valoración a la DB, el backend busca si existe una valoración con esa comp y comport,
	 * de ser así no realiza cambios y lanza excepción. Para actualizar usar {@link update}
	 * @param val La valoración sin el ID con comp, comport y puntuación.
	 * @returns `true` si se ha actualizado, `false` o excepción en caso contrario
	 * @throws TODO: Lanzar excepción
	 */
	async add(val: IValoracionToAddDTO): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/valoraciones`, val).toPromise();
	}

	/**
	 * Actualiza la puntuación de una valoración ya creada
	 * @param val La valoración con el ID y la puntuación actualizada
	 * @returns `true` si se ha actualizado, `false` o excepción en caso contrario
	 * @throws TODO: Lanzar excepción
	 */
	async update(val: IValoracion): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/valoraciones`, val).toPromise();
	}
}
