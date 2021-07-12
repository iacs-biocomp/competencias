import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisEvaluacionesComponent } from './mis-evaluaciones/mis-evaluaciones.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { EvaluacionesService } from './evaluaciones.service';
import { HttpClient } from '@angular/common/http';
import { JwtService } from 'src/app/services/auth/jwt.service';
import { ValoracionesService } from './valoraciones.service';
import { evId, ListPeopleToEvalComponent } from './list-people-to-eval/list-people-to-eval.component';
import { ValoracionesEvPersonaComponent } from './valoracion-persona/valoraciones-ev-persona/valoraciones-ev-persona.component';
import {
	dniId,
	ValoracionesEvPersonaLayoutComponent,
} from './valoracion-persona/list-valoraciones-layout/list-valoraciones-layout.component';
import { CompRoutes } from 'src/app/types/angular-modified-types';

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
