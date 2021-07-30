import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MisResultadosComponent } from './mis-resultados/mis-resultados.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompRoutes } from 'src/app/types/angular-modified-types';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ResultadosService } from './services/resultados.service';

const routes: CompRoutes = [{ path: '', component: MisResultadosComponent }];

@NgModule({
	declarations: [MisResultadosComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule, NgxChartsModule],
	providers: [ResultadosService],
})
export class ResultadosModule {}
