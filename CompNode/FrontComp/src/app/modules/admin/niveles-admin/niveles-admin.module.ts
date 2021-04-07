import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NivelService } from './services/nivel.service';
import { NivAdmnComponent } from './niv-admn/niv-admn.component';
import { NivTableComponent } from './niv-table/niv-table.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/** Rutas relacionadas con el subModulo de comportamientos */
export const nivRoutes: Routes = [
	{
		path: '',
		component: NivAdmnComponent,
	},
];

@NgModule({
	declarations: [NivAdmnComponent, NivTableComponent],
	imports: [
		CommonModule,
		SharedModule,
	  // TODO: En un futuro habría que reemplazar el modulo formulario por reactiveForms, mas eficientes para el uso dado
		FormsModule,
		ReactiveFormsModule
	],
	providers: [NivelService],
})
export class NivelesAdminModule {}
