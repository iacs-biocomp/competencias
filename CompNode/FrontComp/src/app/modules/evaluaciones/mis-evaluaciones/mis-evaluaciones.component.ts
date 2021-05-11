import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { IEvaluacion } from '../../../../../../interfaces/IEvaluaciones';
import { EvaluacionesService } from '../evaluaciones.service';


/** Enumerador que tiene los 3 estados en los que puede estar una evaluacion */
enum EvalStatus {
	PeriodoEvaluar = 'PERIODOEVALUAR',
	PeriodoResultados = 'PERIODORESULTADOS',
	PeriodoEvaluadores = 'PERIODOEVALUADORES',
}
@Component({
	selector: 'app-mis-evaluaciones',
	templateUrl: './mis-evaluaciones.component.html',
	styleUrls: ['./mis-evaluaciones.component.css'],
})


export class MisEvaluacionesComponent implements OnInit {

	/** Inicializa el enum EvaStatus  */
	eEvalStatus!: EvalStatus;

	evaluacionData!: IEvaluacion[];

	//Pruebas para mostrar un texto u otro en los botones (evaluar o calcular)
	buttonEvaluar = true;
	buttonCalcular = true;

	constructor(private evService: EvaluacionesService, private jwtSv: JwtService) {}

	async ngOnInit(): Promise<void> {
		const decodedToken = this.jwtSv.getDecodedToken();
		this.evaluacionData = await this.evService.evaluacionesUsr(decodedToken.username);
		this.buttonEvaluar = true;
		this.buttonCalcular = true;
	}



	/** Funcion que calculará en que periodo se encuetra la evaluacion (los 3 del ENUM);
	 * y mostrará un botón u otro
	 */
	calcularPeriodoActual(evaluacionActual: IEvaluacion){

		var fecha = new Date();

			if(evaluacionActual.finPropuestas! > fecha){
				return EvalStatus.PeriodoEvaluar;
			} else if(evaluacionActual.endValidacion! > fecha){
				return EvalStatus.PeriodoResultados;
			} else {
			 return	EvalStatus.PeriodoEvaluadores;
			}
	}

}




