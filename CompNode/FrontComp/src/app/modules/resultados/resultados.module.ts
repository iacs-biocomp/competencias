import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MisResultadosComponent } from './mis-resultados/mis-resultados.component';

const routes: Routes = [{ path: '', component: MisResultadosComponent }];

@NgModule({
	declarations: [MisResultadosComponent],
	imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ResultadosModule {}
