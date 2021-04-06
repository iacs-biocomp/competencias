import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComportComponent } from './table-comport/table-comport.component';
import { ComportamientosAdminComponent } from './comp-admin/comportamientos-admin.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComportamientosService } from './services/comport.service';

/** Rutas relacionadas con el modulo de comportamientos */
export const comportRoutes: Routes = [
	{
		path: '',
		component: ComportamientosAdminComponent,
	},
];
@NgModule({
	declarations: [ComportamientosAdminComponent, TableComportComponent],
	imports: [CommonModule, SharedModule, RouterModule],
	providers: [ComportamientosService],
})
export class ComportamientosAdminModule {}
