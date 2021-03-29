import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisCompetenciasComponent } from './mis-competencias/mis-competencias.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: MisCompetenciasComponent }];

@NgModule({
	declarations: [MisCompetenciasComponent],
	imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CompetenciasModule {}
