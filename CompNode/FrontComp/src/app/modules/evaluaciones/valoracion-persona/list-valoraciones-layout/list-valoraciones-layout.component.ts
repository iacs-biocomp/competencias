import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IEvAllRequired, IValoracionToAddDTO } from 'sharedInterfaces/DTO';
import { IEvModel, ITrabajador, IValoracion } from 'sharedInterfaces/Entity';
import { TrabajadoresService } from 'src/app/modules/admin/trabajadores/services/trabajadores.service';
import { JwtService } from 'src/app/services/jwt.service';
import { EvaluacionesService } from '../../evaluaciones.service';
import { evId } from '../../list-people-to-eval/list-people-to-eval.component';
import { ValoracionesService } from '../../valoraciones.service';
import { NotCompletedVal } from '../valoraciones-ev-persona/valoraciones-ev-persona.component';

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
	//TODO: Tsdoc
	evModelObs!: BehaviorSubject<IEvModel>;
	evaluador!: ITrabajador;
	evaluado!: ITrabajador;
	savedValsObs!: BehaviorSubject<IValoracion[]>;
	ev!: IEvAllRequired;
	#evId = Number.parseInt(this.route.snapshot.paramMap.get(evId)!);
	#dniId = this.route.snapshot.paramMap.get(dniId)!;

	constructor(
		private readonly evSv: EvaluacionesService,
		private readonly route: ActivatedRoute,
		private readonly trabSv: TrabajadoresService,
		private readonly valSv: ValoracionesService,
		private readonly jwtSv: JwtService,
	) {}

	async ngOnInit(): Promise<void> {
		const [ev, evaluado, evaluador, savedVals] = await Promise.all([
			this.evSv.getEvWithModel(this.#evId),
			this.trabSv.getOneByDni(this.#dniId),
			this.trabSv.getOneByUsername(this.jwtSv.getDecodedToken().username),
			this.valSv.getUsrEvVals(this.#dniId, this.#evId),
		]);
		this.evModelObs = new BehaviorSubject(ev.model);
		this.evaluado = evaluado;
		this.evaluador = evaluador;
		this.savedValsObs = new BehaviorSubject(savedVals);
	}

	/**
	 * TODO: Tsdoc, testear
	 * @param allVals
	 */
	async saveValoraciones(allVals: NotCompletedVal[]) {
		const alreadySavedVals = this.savedValsObs.value;
		/** Fn de busqueda en el array de alreadySaved, si se niega y filtra se consiguen las nuevas Valoraciones,
		 *  si se niega 2 veces las ya creadas pero actualizadas */
		const findFn = (v: NotCompletedVal) =>
			alreadySavedVals.find(v2 => v2.comp.id === v.comp.id && v2.comport.id === v.comport.id);
		const valsToAdd = allVals.map<IValoracionToAddDTO>(val => {
			return { ev: this.ev, ...val };
		});
		const [newVals, updatedVals] = await Promise.all([
			/** Las valoraciones nuevas sin id */
			valsToAdd.filter(v => !findFn(v)),
			/** Las valoraciones que estaban en DB y se actualizan */
			valsToAdd
				.map<IValoracion | undefined>(vUpdated => {
					const valToUpdate = findFn(vUpdated);
					return !!valToUpdate ? { ...valToUpdate, valoracion: vUpdated.valoracion } : undefined;
				})
				.filter(val => !!val) as IValoracion[],
		]);
		newVals.forEach(v => this.valSv.add(v));
		updatedVals.forEach(v => this.valSv.update(v));
	}
}
