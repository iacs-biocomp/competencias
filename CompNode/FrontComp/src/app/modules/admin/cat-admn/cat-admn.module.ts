import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewContractComponent } from './view-contract/view-contract.component';
import { CatCompetencialesService } from './services/CatCompetenciales.service';
import { ViewCompetComponent } from './view-compet/view-compet.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableContracComponent } from './table-contrac/table-contrac.component';
import { TableCompetComponent } from './table-compet/table-compet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const catRoutes: Routes = [
	{
		path: 'competenciales',
		component: ViewCompetComponent,
	},
	{
		path: 'contractuales',
		component: ViewContractComponent,
	},
	// {
	// 	path: '',
	// 	component: ViewContractComponent,
	// },
];

@NgModule({
	declarations: [ViewContractComponent, ViewCompetComponent, TableContracComponent, TableCompetComponent],
	imports: [
		CommonModule,
		RouterModule,
		SharedModule,
		// TODO: En un futuro habría que reemplazar el modulo formulario por reactiveForms, mas eficientes para el uso dado
		FormsModule,
		ReactiveFormsModule
	],
	providers: [CatCompetencialesService],

})
export class CatAdmnModule {}
