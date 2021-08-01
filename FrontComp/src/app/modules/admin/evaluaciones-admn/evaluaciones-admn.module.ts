import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListEvComponent } from './list-ev/list-ev.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EvaluacionesAdmService } from './services/evaluaciones-adm.service';
import { NewEvModalComponent } from './new-ev-modal/new-ev-modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
// import { NewEvModelComponent } from './modelos/new-ev-model.component';
import { ViewAllModelsComponent } from './modelos/view-all-models/view-all-models.component';
import { ViewEditModelComponent } from './modelos/view-edit-model/view-edit-model.component';
import { SelectComportsModalComponent } from './modelos/select-comports-modal/select-comports-modal.component';
import { NivComportFilterPipe } from './modelos/pipes/niv-comport-filter.pipe';
import { ModelCompSelectComponent } from './new-ev-modal/model-comp-select/model-comp-select.component';
import { CompSelectComponent } from './comp-select/comp-select.component';
import { ObjectiveNivsSelectComponent } from './new-ev-modal/obj-niveles-select/obj-niveles-select.component';
import { CompRoutes } from 'src/app/types/angular-modified-types';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
