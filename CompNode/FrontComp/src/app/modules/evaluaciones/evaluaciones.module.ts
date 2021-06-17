import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisEvaluacionesComponent } from './mis-evaluaciones/mis-evaluaciones.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { EvaluacionesService } from './evaluaciones.service';
import { HttpClient } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import { EvaluarEvConcretaComponent, evId } from './evaluar-ev/evaluar-ev.component';
import { EvalPersonaComponent } from './eval-persona/eval-persona.component';

/** Como se llama el parametro que identifica la evaluación a evaluar */
const routes: Routes = [
	{ path: '', component: MisEvaluacionesComponent },
	{ path: `evaluar/:${evId}`, component: EvalPersonaComponent },
];

@NgModule({
	declarations: [MisEvaluacionesComponent, EvaluarEvConcretaComponent, EvalPersonaComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
	providers: [EvaluacionesService, HttpClient, JwtService],
})
export class EvaluacionesModule {}
