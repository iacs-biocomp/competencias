import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { Roles } from 'sharedInterfaces/Entity';
import { LoginGuard } from './guards/login.guard';
import { JwtService } from './services/auth/jwt.service';
import { BaseLayoutComponent } from './shared/layout/base/base-layout.component';
import { CompRoutes } from './types/angular-modified-types';

const routes: CompRoutes = [
	//!La ruta con path = '' va la ultima, Explicación aqui https://is.gd/qRxAtW (Sino el guard hace loop infinito)
	{
		path: 'admin',
		canLoad: [LoginGuard],
		data: {
			roles: [Roles.ADMIN],
		},
		component: BaseLayoutComponent,
		loadChildren: () => import('./modules/admin/admin.module').then(mod => mod.AdminModule),
	},
	{
		path: 'auth',
		loadChildren: () => import('./modules/auth/auth.module').then(mod => mod.AuthModule),
	},
	{
		path: 'usuario',
		canLoad: [LoginGuard],
		data: {
			roles: [Roles.PUBLIC],
		},
		component: BaseLayoutComponent,
		loadChildren: () => import('./modules/usuario/usuario.module').then(mod => mod.UsuarioModule),
	},
	{
		path: 'competencias',
		canLoad: [LoginGuard],
		data: {
			roles: [Roles.PUBLIC],
		},
		component: BaseLayoutComponent,

		loadChildren: () =>
			import('./modules/competencias/competencias.module').then(mod => mod.CompetenciasModule),
	},
	{
		path: 'resultados',
		canLoad: [LoginGuard],
		data: {
			roles: [Roles.PUBLIC],
		},
		component: BaseLayoutComponent,
		loadChildren: () => import('./modules/resultados/resultados.module').then(mod => mod.ResultadosModule),
	},
	{
		path: 'evaluaciones',
		canLoad: [LoginGuard],

		data: {
			roles: [Roles.PUBLIC],
		},
		component: BaseLayoutComponent,
		loadChildren: () =>
			import('./modules/evaluaciones/evaluaciones.module').then(mod => mod.EvaluacionesModule),
	},
	{
		path: '',
		canLoad: [LoginGuard],
		data: {
			roles: [Roles.PUBLIC],
		},
		component: BaseLayoutComponent,
		loadChildren: () => import('./modules/public/public.module').then(mod => mod.PublicModule),
	},
	//*Redireccionar a public en caso de ruta erronea
	{
		path: '**',
		redirectTo: '/',
	},
	//*Cargar 404 con enlace a public
	// {
	// 	path: '**',
	// 	component: Error404Component,
	// },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	providers: [LoginGuard, JwtHelperService, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, JwtService],
	exports: [RouterModule],
})
export class AppRoutingModule {}
