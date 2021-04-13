import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListEvComponent } from './list-ev/list-ev.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';

/** Rutas relacionadas con el subModulo de comportamientos */
export const evRoutes: Routes = [
	{
		path: '',
		component: ListEvComponent,
	},
];

@NgModule({
	declarations: [ListEvComponent],
	imports: [CommonModule, RouterModule, SharedModule],
	providers: [HttpClient, JwtService],
})
export class EvaluacionesAdmnModule {}
