import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrabTableComponent } from './trab-table/trab-table.component';
import { TrabajadoresService } from './services/trabajadores.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// TODO: CompRoutes, circular dependency
/** Rutas relacionadas con el modulo de trabajadores */
export const trabRoutes: Routes = [
	{
		path: '',
		component: TrabTableComponent,
	},
];

// TODO: Tsdoc del MODULO
@NgModule({
	declarations: [TrabTableComponent],
	imports: [CommonModule, RouterModule, SharedModule, FormsModule, ReactiveFormsModule],
	providers: [TrabajadoresService],
})
export class TrabajadoresModule {}
