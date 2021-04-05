import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompetenciasAdminComponent } from './competencias-admin/competencias-admin.component';
import { OrganigramaAdminComponent } from './organigrama-admin/organigrama-admin.component';

const routes: Routes = [
	{ path: 'competencias', component: CompetenciasAdminComponent },
	{ path: 'organigrama', component: OrganigramaAdminComponent },
	{ path: '', redirectTo: '/' },

	// { path: '', component: CompetenciasAdminComponent },
];

@NgModule({
	declarations: [CompetenciasAdminComponent, OrganigramaAdminComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
/** De este modulo cuelga toda la interfaz que el administrador utilizará,
 * para asi al servirla en Nest sea mas facil autorizar la descarga de este */
export class AdminModule {}
