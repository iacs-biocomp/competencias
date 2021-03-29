import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './datos/datos.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MisDatosComponent } from './datos/mis-datos/mis-datos.component';

const routes: Routes = [{ path: 'datos', component: DatosComponent }];
@NgModule({
	declarations: [DatosComponent, MisDatosComponent],
	imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class UsuarioModule {}
