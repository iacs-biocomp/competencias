import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComportComponent } from './table-comport/table-comport.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComportService } from './services/comport.service';

/** Rutas relacionadas con el modulo de comportamientos */
export const comportRoutes: Routes = [
	{
		path: '',
		component: TableComportComponent,
	},
];
@NgModule({
	declarations: [TableComportComponent],
	imports: [CommonModule, SharedModule, RouterModule, FormsModule, ReactiveFormsModule],
	providers: [ComportService],
})
export class ComportamientosAdminModule {}
