import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IEvModel, ITrabajador, IValoracion } from 'sharedInterfaces/Entity';
import { TrabajadoresService } from 'src/app/modules/admin/trabajadores/services/trabajadores.service';
import { EvaluacionesService } from '../../evaluaciones.service';
import { evId } from '../../list-people-to-eval/list-people-to-eval.component';
import { ValoracionesService } from '../../valoraciones.service';

/** Como se llama el parametro que identifica la evaluación a evaluar */
export const dniId = 'dniId';
/**
 * TODO: Tsdoc
 */
@Component({
	selector: 'app-list-valoraciones-ev-persona',
	templateUrl: './list-valoraciones-layout.component.html',
	styleUrls: ['./list-valoraciones-layout.component.scss'],
})
export class ValoracionesEvPersonaLayoutComponent implements OnInit {
	evModelObs!: BehaviorSubject<IEvModel>;
	trabajador!: ITrabajador;
	savedValsObs!: BehaviorSubject<IValoracion[]>;
	#evId = Number.parseInt(this.route.snapshot.paramMap.get(evId)!);
	#dniId = this.route.snapshot.paramMap.get(dniId)!;

	constructor(
		private readonly evSv: EvaluacionesService,
		private route: ActivatedRoute,
		private trabSv: TrabajadoresService,
		private valSv: ValoracionesService,
	) {}

	async ngOnInit(): Promise<void> {
		const [ev, worker, savedVals] = await Promise.all([
			this.evSv.getEvWithModel(this.#evId),
			this.trabSv.getOneByDni(this.#dniId),
			this.valSv.getUsrEvVals(this.#dniId, this.#evId),
		]);
		this.evModelObs = new BehaviorSubject(ev.model);
		this.trabajador = worker;
		this.savedValsObs = new BehaviorSubject(savedVals);
	}

	/**
	 *
	 * @param allVals
	 */
	async saveValoraciones(allVals: IValoracion[]) {
		const alreadySavedVals = this.savedValsObs.value;
		/** Fn de busqueda en el array de alreadySaved, si se niega y filtra se consiguen las nuevas Valoraciones,
		 *  si se niega 2 veces las ya creadas pero actualizadas */
		const findFn = (v: IValoracion) =>
			alreadySavedVals.find(v2 => v2.comp.id === v.comp.id && v2.comport.id === v.comport.id);
		const [newVals, updatedVals] = await Promise.all([
			allVals.filter(v => !findFn(v)),
			allVals.filter(v => !!findFn(v)),
		]);
		newVals.forEach(v => this.valSv.add(v));
		updatedVals.forEach(v => this.valSv.update(v));
	}
}
