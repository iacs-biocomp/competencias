import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CatCompetencialesService } from 'services/data';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompRoutes } from 'src/app/types/angular-modified-types';
import { TableCatCompComponent, TableContracComponent } from './components';

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
