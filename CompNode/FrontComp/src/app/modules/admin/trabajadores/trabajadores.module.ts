import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TrabajadoresLayoutComponent } from './trabajadores-layout/trabajadores-layout.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrabTableComponent } from './trab-table/trab-table.component';
import { TrabajadoresService } from './services/trabajadores.service';
import { FormsModule } from '@angular/forms';

/** Rutas relacionadas con el modulo de trabajadores */
export const trabRoutes: Routes = [
	{
		path: '',
		component: TrabajadoresLayoutComponent,
	},
];

@NgModule({
	declarations: [TrabajadoresLayoutComponent, TrabTableComponent],
	imports: [CommonModule, RouterModule, SharedModule, FormsModule],
	providers: [TrabajadoresService],
})
export class TrabajadoresModule {}
