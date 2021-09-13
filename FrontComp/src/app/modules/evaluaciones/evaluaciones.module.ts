import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JwtService } from 'src/app/services/auth/jwt.service';
import { EvaluacionesService, ValoracionesService } from 'src/app/services/data';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompRoutes } from 'src/app/types/angular-modified-types';
import {
	MisEvaluacionesComponent,
	ListPeopleToEvalComponent,
	ValoracionesEvPersonaComponent,
	dniId,
	evId,
	ValoracionesEvPersonaLayoutComponent,
} from './components';

const routes: CompRoutes = [
	{ path: '', component: MisEvaluacionesComponent },
	{ path: `evaluar/:${evId}`, component: ListPeopleToEvalComponent },
	{ path: `evaluar/:${evId}/:${dniId}`, component: ValoracionesEvPersonaLayoutComponent },
];

/**
 * Modulo con componentes relacionados con las evaluaciones/valoraciones/resultados del Usuario.
 */
@NgModule({
	declarations: [
		MisEvaluacionesComponent,
		ListPeopleToEvalComponent,
		ValoracionesEvPersonaComponent,
		ValoracionesEvPersonaLayoutComponent,
	],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
	providers: [EvaluacionesService, HttpClient, JwtService, ValoracionesService],
})
export class EvaluacionesModule {}
