import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetenciasService } from '../../../services/data/competencias.service';
import { TableCompetenciasComponent } from './components/table-competencias/table-competencias.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CompRoutes } from 'src/app/types/angular-modified-types';

/** Rutas relacionadas con el modulo de competencias */
export const compRoutes: CompRoutes = [
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
