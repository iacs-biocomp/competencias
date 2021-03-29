import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisCompetenciasComponent } from './mis-competencias/mis-competencias.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{ path: '', component: MisCompetenciasComponent }];

@NgModule({
	declarations: [MisCompetenciasComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class CompetenciasModule {}
