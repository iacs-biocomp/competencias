import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEvSendDTO, IUpdateEvShowingResultsDTO } from 'sharedInterfaces/DTO';
import { IEvaluacion } from 'sharedInterfaces/Entity';
import { environment as cnf } from 'src/environments/environment';
import { LogService } from 'src/app/shared/log/log.service';

/** Tiene todos los metodos necesarios para la administración de las Evaluaciones y Modelos */
@Injectable({ providedIn: 'root' })
export class EvaluacionesAdmService {
	constructor(private httpClient: HttpClient, private readonly logger: LogService) {}

	/**
	 * @returns Una promsesa que se resuelve como un array de todas las evaluaciones que tiene el backend
	 * TODO: DTO return type
	 */
	public async getAll(): Promise<IEvaluacion[]> {
		const url = `${cnf.apiURL}/evaluaciones`;
		this.logger.debug(`Obteniendo todas las evaluaciones de: ${url}`);
		return this.httpClient.get<IEvaluacion[]>(url).toPromise();
	}

	/**
	 * @param id id de la evaluacion a borrar
	 * @returns una promesa que se resulelve como boolean `true` si se puede borar, `false` si no
	 * @throws completar
	 */
	delete(ev: IEvaluacion['id'] | Pick<IEvaluacion, 'id'>): Promise<true> {
		const evalId = typeof ev === 'number' ? ev : ev.id;
		const url = `${cnf.apiURL}/evaluaciones/${evalId}`;
		this.logger.debug(`Eliminando ev con ID: ${evalId}, mandando req a: ${url}`);
		return this.httpClient.delete<true>(url).toPromise();
	}

	/**
	 *
	 * @param evalu la evaluacion a guardar
	 * @returns una promesa que se resuelve como boolean `true` si se puede guardar, `false` si no
	 * @throws completar a futuro
	 */
	add(ev: IEvSendDTO): Promise<true> {
		const url = `${cnf.apiURL}/evaluaciones`;
		this.logger.debug(`POST req a: ${url}, añadiendo evaluación:`, ev);
		return this.httpClient.post<true>(url, ev).toPromise();
	}

	// /**
	//  *
	//  * @param evalu la evaluacion que se quiere editar
	//  * @returns una promesa que se resuelve como boolean `true` si se puede editar, `false` si no
	//  * TODO: DONE, testear
	//  *
	//  */
	// edit(evalu: IEvSendDTO): Promise<boolean> {
	// 	return this.httpClient.put<boolean>(`${cnf.apiURL}/evaluaciones`, evalu).toPromise();
	// }

	updateShowingResults(payload: IUpdateEvShowingResultsDTO) {
		const url = `${cnf.apiURL}/evaluaciones/showing-results`;
		this.logger.debug(
			`Actualizando valor del slideToggleBtn para mostrar/ocultar resultados, valor: ${payload.isShowingResults}, POST req a ${url}`,
			payload,
		);
		return this.httpClient.post<true>(url, payload).toPromise();
	}
}
