import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NivelService } from 'services/data';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompRoutes } from 'src/app/types/angular-modified-types';
import { NivTableComponent } from './components';

/** Rutas relacionadas con el subModulo de comportamientos */
export const nivRoutes: CompRoutes = [
	{
		path: '',
		component: NivTableComponent,
	},
];

@NgModule({
	declarations: [NivTableComponent],
	imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule],
	providers: [NivelService],
})
export class NivelesAdminModule {}
