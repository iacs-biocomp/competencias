import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelosComponent } from './modelos.component';
import { ModelosService } from './services/modelos.service';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModeloCompetComponent } from './modelo-compet/modelo-compet.component';

@NgModule({
	declarations: [ModelosComponent, ModeloCompetComponent],
	imports: [
		CommonModule,
		RouterModule,
		SharedModule,
		// TODO: En un futuro habría que reemplazar el modulo formulario por reactiveForms, mas eficientes para el uso dado
		FormsModule,
		ReactiveFormsModule,
	],
	providers: [ModelosService],
})
export class ModelosModule {}
