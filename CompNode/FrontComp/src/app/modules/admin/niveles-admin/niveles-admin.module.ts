import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NivAdmnComponent } from './niv-admn/niv-admn.component';
import { NivTableComponent } from './niv-table/niv-table.component';
import { Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

/** Rutas relacionadas con el subModulo de comportamientos */
export const nivRoutes: Routes = [
	{
		path: '',
		component: NivAdmnComponent,
	},
];

@NgModule({
	declarations: [NivAdmnComponent, NivTableComponent],
	imports: [CommonModule, SharedModule],
})
export class NivelesAdminModule {}
