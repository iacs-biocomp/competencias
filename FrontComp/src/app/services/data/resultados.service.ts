import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResultadoDTOV2 } from 'sharedInterfaces/DTO';
import { IEvaluacion, ITrabajador } from 'sharedInterfaces/Entity';
import { RESULTS2 } from 'src/app/modules/resultados/mis-resultados/data';
import { LogService } from 'src/app/shared/log/log.service';

@Injectable({ providedIn: 'root' })
export class ResultsService {
	constructor(private readonly httpClient: HttpClient) {}

	//TODO: implementar fetch de resultados, dto probablemente sin hacer
	getFromEvAndWorker(evId: IEvaluacion['id'], dni: ITrabajador['dni']): Promise<IResultadoDTOV2[]> {
		//LOG: Obteniendo resultados de la ev ${evId}, con dni ${dni}, url: ${apiUrlReq}
		return new Promise(res =>
			setTimeout(() => {
				res(RESULTS2);
			}, 500),
		);
		// return this.httpClient.get<IResultadoDTOV2[]>(`${cnf.apiURL}/resultados/${evId}/${dni}`).toPromise();
	}
}
