import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { IEvaluacion } from '../../../../../../interfaces/IEvaluaciones';
import { EvaluacionesService } from '../evaluaciones.service';

@Component({
	selector: 'app-mis-evaluaciones',
	templateUrl: './mis-evaluaciones.component.html',
	styleUrls: ['./mis-evaluaciones.component.css'],
})
export class MisEvaluacionesComponent implements OnInit {
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
}
