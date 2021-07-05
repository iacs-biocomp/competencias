import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NivelService } from './services/nivel.service';
import { NivTableComponent } from './niv-table/niv-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompRoutes } from 'src/app/types/angular-modified-types';

// TODO: DONE
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
