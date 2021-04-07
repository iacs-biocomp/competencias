import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListEvComponent } from './list-ev/list-ev.component';
import { RouterModule, Routes } from '@angular/router';

/** Rutas relacionadas con el subModulo de comportamientos */
export const evRoutes: Routes = [
	{
		path: '',
		component: ListEvComponent,
	},
];

@NgModule({
	declarations: [ListEvComponent],
	imports: [CommonModule, RouterModule],
})
export class EvaluacionesAdmnModule {}
