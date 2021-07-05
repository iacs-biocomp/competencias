import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrganiGeneralView } from './general-organi-view/organigrama-admin.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { CompRoutes } from 'src/app/types/angular-modified-types';

// TODO: DONE
/** Rutas relacionadas con el modulo del organigrama */
export const organiRoutes: CompRoutes = [
	{
		path: '',
		component: OrganiGeneralView,
	},
];
@NgModule({
	imports: [SharedModule, CommonModule, MatAutocompleteModule, FormsModule],
	exports: [],
	declarations: [OrganiGeneralView],
	providers: [],
})
export class OrganiAdmnModule {}
