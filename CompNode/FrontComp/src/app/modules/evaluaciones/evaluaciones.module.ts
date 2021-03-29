import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisEvaluacionesComponent } from './mis-evaluaciones/mis-evaluaciones.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{ path: '', component: MisEvaluacionesComponent }];

@NgModule({
	declarations: [MisEvaluacionesComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class EvaluacionesModule {}
