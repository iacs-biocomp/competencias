import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisEvaluacionesComponent } from './mis-evaluaciones/mis-evaluaciones.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: MisEvaluacionesComponent }];

@NgModule({
	declarations: [MisEvaluacionesComponent],
	imports: [CommonModule, RouterModule.forChild(routes)],
})
export class EvaluacionesModule {}
