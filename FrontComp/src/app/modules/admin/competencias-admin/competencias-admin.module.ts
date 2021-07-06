import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetenciasService } from './services/competencias.service';
import { TableCompetenciasComponent } from './table-competencias/table-competencias.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

/** Rutas relacionadas con el modulo de competencias */
export const compRoutes: Routes = [
	{
		path: '',
		component: TableCompetenciasComponent,
	},
];
@NgModule({
	declarations: [TableCompetenciasComponent],
	imports: [CommonModule, FormsModule, RouterModule, SharedModule],
	providers: [CompetenciasService],
})
/** Modulo que recoge todos los compontentes relacionados con las competencias */
export class CompetenciasAdminModule {}
