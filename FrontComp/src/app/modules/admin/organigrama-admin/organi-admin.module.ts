import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompRoutes } from 'src/app/types/angular-modified-types';
import { OrganiGeneralView } from './components';

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
