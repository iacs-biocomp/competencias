import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisEvaluacionesComponent } from './mis-evaluaciones/mis-evaluaciones.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { EvaluacionesService } from './evaluaciones.service';
import { HttpClient } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';

const routes: Routes = [{ path: '', component: MisEvaluacionesComponent }];

@NgModule({
	declarations: [MisEvaluacionesComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
	providers: [EvaluacionesService, HttpClient, JwtService],
})
export class EvaluacionesModule {}
