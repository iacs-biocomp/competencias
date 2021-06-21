import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisEvaluacionesComponent } from './mis-evaluaciones/mis-evaluaciones.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { EvaluacionesService } from './evaluaciones.service';
import { HttpClient } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import { ValoracionesService } from './valoraciones.service';
import { evId, ListPeopleToEvalComponent } from './list-people-to-eval/list-people-to-eval.component';
import { ValoracionesEvPersonaComponent } from './valoracion-persona/valoraciones-ev-persona/valoraciones-ev-persona.component';
import {
	dniId,
	ValoracionesEvPersonaLayoutComponent,
} from './valoracion-persona/list-valoraciones-layout/list-valoraciones-layout.component';

const routes: Routes = [
	{ path: '', component: MisEvaluacionesComponent },
	{ path: `evaluar/:${evId}`, component: ListPeopleToEvalComponent },
	{ path: `evaluar/:${evId}/eval-persona/:${dniId}`, component: ValoracionesEvPersonaLayoutComponent },
];

/**
 * TODO: Tsdoc de la utilidad de este modulo
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
