import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListEvComponent } from './list-ev/list-ev.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EvaluacionesAdmService } from './services/evaluaciones-adm.service';
import { NewEvModalComponent } from './new-ev-modal/new-ev-modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { NewEvModelComponent } from './modelos/new-ev-model.component';

/** Rutas relacionadas con el subModulo de comportamientos */
export const evRoutes: Routes = [
	{
		path: '',
		component: ListEvComponent,
	},
	// {
	// 	path: 'test',
	// 	component: LayoutTestComponent,
	// },
];

/** Contiene los componentes para la visualización y administración de las evaluaciones y sus modelos */
@NgModule({
	declarations: [
		ListEvComponent,
		NewEvModelComponent,
		NewEvModalComponent,
		// ViewEditModelComponent,
		// LayoutTestComponent,
	],
	imports: [
		CommonModule,
		RouterModule,
		SharedModule,
		FormsModule,
		ReactiveFormsModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatNativeDateModule,
	],
	providers: [EvaluacionesAdmService],
})
export class EvaluacionesAdmnModule {}
