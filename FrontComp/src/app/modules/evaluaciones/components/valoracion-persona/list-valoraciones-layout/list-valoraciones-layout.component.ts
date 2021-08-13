import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { JwtService } from 'services/auth';
import { EvaluacionesService, TrabajadoresService, ValoracionesService } from 'services/data';
import {
	IEvModelGetDTO,
	ITrabajadorDTO,
	IEvAllRequiredDTO,
	IValoracionAddDTO,
	IValoracionUpdateDTO,
	IValoracionSettedDTO,
} from 'sharedInterfaces/DTO';
import { LogService } from 'src/app/shared/log/log.service';
import { ValOpId } from '..';
// TODO: Refactor estos dos imports
import { evId } from '../../list-people-to-eval/list-people-to-eval.component';

/** Como se llama el parametro que identifica la evaluación a evaluar */
export const dniId = 'dniId';

/**
 * Muestra en diferentes cards la lista de personas a valorar en una evaluacion
 */
@Component({
	selector: 'app-list-valoraciones-ev-persona',
	templateUrl: './list-valoraciones-layout.component.html',
	styleUrls: ['./list-valoraciones-layout.component.scss'],
})
export class ValoracionesEvPersonaLayoutComponent implements OnInit {
	/** Observable de modelo, cuando cambie el modelo debe actualizarse el valor */
	evModelObs!: BehaviorSubject<IEvModelGetDTO>;
	evaluador!: ITrabajadorDTO;
	evaluado!: ITrabajadorDTO;
	savedValsObs!: BehaviorSubject<IValoracionSettedDTO[]>;
	ev!: IEvAllRequiredDTO;
	evId = Number.parseInt(this.route.snapshot.paramMap.get(evId)!);
	#dniId = this.route.snapshot.paramMap.get(dniId)!;
	isDataLoaded = false;

	constructor(
		private readonly evSv: EvaluacionesService,
		private readonly route: ActivatedRoute,
		private readonly trabSv: TrabajadoresService,
		private readonly valSv: ValoracionesService,
		private readonly jwtSv: JwtService,
		private readonly logger: LogService,
	) {}

	async ngOnInit(): Promise<void> {
		const [ev, evaluado, evaluador, savedVals] = await Promise.all([
			this.evSv.getEvWithModel(this.evId),
			this.trabSv.getOneByDni(this.#dniId),
			this.trabSv.getOneByUsername(this.jwtSv.getDecodedToken().username),
			this.valSv.getUsrEvVals(this.#dniId, this.evId),
		]);
		this.evModelObs = new BehaviorSubject(ev.model);
		this.evaluado = evaluado;
		this.evaluador = evaluador;
		this.savedValsObs = new BehaviorSubject(savedVals);
		this.isDataLoaded = true;
	}

	/**
	 * Guarda las valoraciones que recibe del componente hijo.
	 * Las filtra para añadir o actualizar según si estaban o no guardadas.
	 * @param allVals Array de todas las valoraciones, sin id (a actualizar y añadir)
	 */
	async saveValoraciones(allVals: ValOpId[]): Promise<void> {
		// TODO: Refactor (reducir complejidad trozeando la función)
		const alreadySavedVals = this.savedValsObs.value;
		/** Fn de busqueda en el array de alreadySaved, si se niega y filtra se consiguen las nuevas Valoraciones,
		 *  si se niega 2 veces las ya creadas pero actualizadas */
		const findFn = (v: Pick<IValoracionSettedDTO, 'comp' | 'comport'>) =>
			alreadySavedVals.find(v2 => v2.comp === v.comp && v2.comport === v.comport);

		const [newVals, updatedVals] = await Promise.all([
			/** Las valoraciones nuevas sin id */
			allVals.filter<IValoracionAddDTO>((v): v is IValoracionAddDTO => !findFn(v)),
			/** Las valoraciones que estaban en DB y se actualizan */
			allVals
				.filter<IValoracionSettedDTO>((val): val is IValoracionSettedDTO => !!findFn(val))
				.map<IValoracionUpdateDTO>(vUpdated => {
					return { id: vUpdated.id, valoracion: vUpdated.valoracion };
				}),
		]);
		this.logger.log(
			`Se van a guardar las valoraciones ${newVals} y a actualizar las valoraciones ${updatedVals}`,
		);
		newVals.forEach(v => this.valSv.add(v));
		updatedVals.forEach(v => this.valSv.update(v));
	}
}
