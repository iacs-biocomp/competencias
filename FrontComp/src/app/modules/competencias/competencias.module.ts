import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CurrCompetComponent } from './curr-compet/curr-compet.component';

const routes: Routes = [{ path: '', component: CurrCompetComponent }];

// TODO: Tsdoc de que hace el MODULO, tal vez cambiar nombre e incluir en otro modulo
@NgModule({
	declarations: [CurrCompetComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class CompetenciasModule {}
