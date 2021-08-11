import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { EvaluacionesAdmService } from 'services/data';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompRoutes } from 'src/app/types/angular-modified-types';
import { ListEvComponent, NewEvModalComponent, CompSelectComponent } from './components';
import { NivComportFilterPipe } from './components/modelos/pipes/niv-comport-filter.pipe';
import { SelectComportsModalComponent } from './components/modelos/select-comports-modal/select-comports-modal.component';
import { ViewAllModelsComponent } from './components/modelos/view-all-models/view-all-models.component';
import { ViewEditModelComponent } from './components/modelos/view-edit-model/view-edit-model.component';
import { ModelCompSelectComponent } from './components/new-ev-modal/model-comp-select/model-comp-select.component';
import { ObjectiveNivsSelectComponent } from './components/new-ev-modal/obj-niveles-select/obj-niveles-select.component';

/** Rutas relacionadas con el subModulo de evaluaciones */
export const evRoutes: CompRoutes = [
	{
		path: '',
		component: ListEvComponent,
	},
	{
		path: 'modelos-reference',
		component: ViewAllModelsComponent,
	},
];

/** Contiene los componentes para la visualización y administración de las evaluaciones y sus modelos */
@NgModule({
	declarations: [
		ListEvComponent,
		// NewEvModelComponent,
		NewEvModalComponent,
		ViewAllModelsComponent,
		ViewEditModelComponent,
		ModelCompSelectComponent,
		ObjectiveNivsSelectComponent,
		SelectComportsModalComponent,
		NivComportFilterPipe,
		CompSelectComponent,
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
		MatSlideToggleModule,
	],
	// exports: [MatSlideToggleModule],
	providers: [EvaluacionesAdmService],
})
export class EvaluacionesAdmnModule {}
