import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompetenciasAdminModule, compRoutes } from './competencias-admin/competencias-admin.module';
import { comportRoutes } from './comportamientos-admin/comportamientos-admin.module';
import { NivelesAdminModule, nivRoutes } from './niveles-admin/niveles-admin.module';
import { CatAdmnModule, catRoutes } from './cat-admn/cat-admn.module';
import { EvaluacionesAdmnModule, evRoutes } from './evaluaciones-admn/evaluaciones-admn.module';
import { TrabajadoresModule, trabRoutes } from './trabajadores/trabajadores.module';
import { OrganiAdmnModule, organiRoutes } from './organigrama-admin/organi-admin.module';
import { CompRoutes } from 'src/app/types/angular-modified-types';

const routes: CompRoutes = [
	{ path: 'comportamientos', children: comportRoutes },
	{ path: 'competencias', children: compRoutes },
	{ path: 'niveles', children: nivRoutes },
	{ path: 'categorias', children: catRoutes },
	{ path: 'evaluaciones', children: evRoutes },
	{ path: 'trabajadores', children: trabRoutes },
	{ path: 'organigrama', children: organiRoutes },
	{ path: '', redirectTo: '/' },

	// { path: '', component: CompetenciasAdminComponent },
];

/** De este modulo cuelga toda la interfaz que el administrador utilizará,
 * para asi al servirla en Nest sea mas facil autorizar la descarga de este */
@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		SharedModule,
		CompetenciasAdminModule,
		CatAdmnModule,
		EvaluacionesAdmnModule,
		NivelesAdminModule,
		TrabajadoresModule,
		OrganiAdmnModule,
	],
	exports: [SharedModule],
})
export class AdminModule {}
