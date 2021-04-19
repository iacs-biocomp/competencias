import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrganiGeneralView } from './general-organi-view/organigrama-admin.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

/** Rutas relacionadas con el modulo del organigrama */
export const organiRoutes: Routes = [
	{
		path: '',
		component: OrganiGeneralView,
	},
];
@NgModule({
	imports: [SharedModule, CommonModule, MatAutocompleteModule],
	exports: [],
	declarations: [OrganiGeneralView],
	providers: [],
})
export class OrganiAdmnModule {}
