import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrabTableComponent } from './components/trab-table/trab-table.component';
import { TrabajadoresService } from '../../../services/data/trabajadores.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompRoutes } from 'src/app/types/angular-modified-types';

/** Rutas relacionadas con el modulo de trabajadores */
export const trabRoutes: CompRoutes = [
	{
		path: '',
		component: TrabTableComponent,
	},
];

/**
 * Modulo destinado a la administración de los trabajadores
 */
@NgModule({
	declarations: [TrabTableComponent],
	imports: [CommonModule, RouterModule, SharedModule, FormsModule, ReactiveFormsModule],
	providers: [TrabajadoresService],
})
export class TrabajadoresModule {}
