import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatCompetencialesService } from './services/CatCompetenciales.service';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableContracComponent } from './table-contrac/table-contrac.component';
import { TableCatCompComponent } from './table-compet/table-compet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompRoutes } from 'src/app/types/angular-modified-types';

export const catRoutes: CompRoutes = [
	{
		path: 'competenciales',
		component: TableCatCompComponent,
	},
	{
		path: 'contractuales',
		component: TableContracComponent,
	},
];

@NgModule({
	declarations: [TableContracComponent, TableCatCompComponent],
	imports: [CommonModule, RouterModule, SharedModule, FormsModule, ReactiveFormsModule],
	providers: [CatCompetencialesService],
})
export class CatAdmnModule {}
