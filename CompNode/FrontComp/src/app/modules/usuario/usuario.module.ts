import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './datos/datos.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MisDatosComponent } from './datos/mis-datos/mis-datos.component';
import { UsrOrganigramaComponent } from './usr-organigrama/miOrganigrama/usr-organigrama.component';
import { LayoutOrgComponent } from './usr-organigrama/organigrama.component';

const routes: Routes = [
	{ path: 'datos', component: DatosComponent },
	{ path: 'organigrama', component: LayoutOrgComponent },
	{ path: '', redirectTo: '/' },
];
@NgModule({
	declarations: [DatosComponent, MisDatosComponent, LayoutOrgComponent, UsrOrganigramaComponent],
	imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class UsuarioModule {}
