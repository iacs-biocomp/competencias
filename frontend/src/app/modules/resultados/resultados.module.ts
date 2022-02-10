import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ResultsService } from 'services/data';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompRoutes } from 'src/app/types/angular-modified-types';
import { RouteParamsNames, MisResultadosComponent } from './mis-resultados/mis-resultados.component';

const routes: CompRoutes = [
	{ path: `:${RouteParamsNames.EV_ID}/:${RouteParamsNames.DNI}`, component: MisResultadosComponent },
];

@NgModule({
	declarations: [MisResultadosComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule, NgxChartsModule],
	providers: [ResultsService],
})
export class ResultadosModule {}
