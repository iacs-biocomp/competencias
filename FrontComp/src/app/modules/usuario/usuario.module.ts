import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MisDatosComponent } from './datos/mis-datos/mis-datos.component';
import { UsrOrganigramaComponent } from './usr-organigrama/miOrganigrama/usr-organigrama.component';
import { CompRoutes } from 'src/app/types/angular-modified-types';

const routes: CompRoutes = [
	{ path: 'datos', component: MisDatosComponent },
	{ path: 'organigrama', component: UsrOrganigramaComponent },
	{ path: '', redirectTo: '/' },
];
@NgModule({
	declarations: [MisDatosComponent, UsrOrganigramaComponent],
	imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class UsuarioModule {}
