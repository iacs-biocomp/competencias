import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CurrCompetComponent } from './curr-compet/curr-compet.component';
import { CompRoutes } from 'src/app/types/angular-modified-types';
import { RouterModule } from '@angular/router';

const routes: CompRoutes = [{ path: '', component: CurrCompetComponent }];

// ?? tal vez cambiar nombre e incluir en otro modulo
/**
 * Modulo destinado a mostrar datos sobre las competencias (actuales pasadas etc...) Lo pueden ver los usuarios.
 */
@NgModule({
	declarations: [CurrCompetComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class CompetenciasModule {}
