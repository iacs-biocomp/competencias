import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MisResultadosComponent } from './mis-resultados/mis-resultados.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{ path: '', component: MisResultadosComponent }];

@NgModule({
	declarations: [MisResultadosComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class ResultadosModule {}
