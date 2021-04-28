import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatCompetencialesService } from './services/CatCompetenciales.service';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableContracComponent } from './table-contrac/table-contrac.component';
import { TableCompetComponent } from './table-compet/table-compet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const catRoutes: Routes = [
	{
		path: 'competenciales',
		component: TableCompetComponent,
	},
	{
		path: 'contractuales',
		component: TableContracComponent,
	},
];

@NgModule({
	declarations: [TableContracComponent, TableCompetComponent],
	imports: [
		CommonModule,
		RouterModule,
		SharedModule,
		FormsModule,
		ReactiveFormsModule,
	],
	providers: [CatCompetencialesService],
})
export class CatAdmnModule {}
