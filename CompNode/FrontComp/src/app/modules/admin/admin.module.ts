import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrganigramaAdminComponent } from './organigrama-admin/organigrama-admin.component';
import { CompetenciasAdminModule, compRoutes } from './competencias-admin/competencias-admin.module';
import {
	ComportamientosAdminModule,
	comportRoutes,
} from './comportamientos-admin/comportamientos-admin.module';
import { NivelesAdminModule, nivRoutes } from './niveles-admin/niveles-admin.module';
import { CatAdmnModule, catRoutes } from './cat-admn/cat-admn.module';
import { EvaluacionesAdmnModule, evRoutes } from './evaluaciones-admn/evaluaciones-admn.module';

const routes: Routes = [
	{ path: 'comportamientos', children: comportRoutes },
	{ path: 'competencias', children: compRoutes },
	{ path: 'niveles', children: nivRoutes },
	{ path: 'categorias', children: catRoutes },
	{ path: 'evaluaciones', children: evRoutes },
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
		CatAdmnModule,
		EvaluacionesAdmnModule,
		NivelesAdminModule,
	],
	exports: [SharedModule],
})
/** De este modulo cuelga toda la interfaz que el administrador utilizará,
 * para asi al servirla en Nest sea mas facil autorizar la descarga de este */
export class AdminModule {}
