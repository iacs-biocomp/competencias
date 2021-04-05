import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrganigramaAdminComponent } from './organigrama-admin/organigrama-admin.component';
import {
	CompetenciasAdminModule,
	compRoutes,
} from './competencias-admin/competencias-admin.module';

const routes: Routes = [
	{ path: 'competencias', children: compRoutes },
	{ path: 'organigrama', component: OrganigramaAdminComponent },
	{ path: '', redirectTo: '/' },

	// { path: '', component: CompetenciasAdminComponent },
];

@NgModule({
	declarations: [OrganigramaAdminComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		SharedModule,
		CompetenciasAdminModule,
	],
	exports: [SharedModule],
})
/** De este modulo cuelga toda la interfaz que el administrador utilizará,
 * para asi al servirla en Nest sea mas facil autorizar la descarga de este */
export class AdminModule {}
