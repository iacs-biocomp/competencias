import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AppComponent } from './app.component';
import { LoginGuard } from './guards/login.guard';
import { Error404Component } from './modules/app/error404/error404.component';
// export interface RouteData {
// 	roles: 'PUBLIC' | 'ADMIN ';
// 	ShowSideBar: boolean;
// }

// interface MyRoutes extends Route {
// 	data?: RouteData;
// }
const routes: Routes = [
	//!La ruta con path = '' va la ultima, Explicación aqui https://is.gd/qRxAtW (Sino el guard hace loop infinito)
	{
		path: 'admin',
		canLoad: [LoginGuard],
		data: {
			roles: ['ADMIN'],
		},
		loadChildren: () =>
			import('./modules/admin/admin.module').then((mod) => mod.AdminModule),
	},
	{
		path: 'auth',
		loadChildren: () =>
			import('./modules/auth/auth.module').then((mod) => mod.AuthModule),
	},
	{
		//?: Nombre correcto?
		path: 'usuario',
		canLoad: [LoginGuard],
		data: {
			roles: ['PUBLIC'],
		},
		loadChildren: () =>
			import('./modules/usuario/usuario.module').then(
				(mod) => mod.UsuarioModule
			),
	},
	{
		path: 'competencias',
		canLoad: [LoginGuard],
		data: {
			roles: ['PUBLIC'],
		},
		loadChildren: () =>
			import('./modules/competencias/competencias.module').then(
				(mod) => mod.CompetenciasModule
			),
	},
	{
		path: 'resultados',
		canLoad: [LoginGuard],
		data: {
			roles: ['PUBLIC'],
		},
		loadChildren: () =>
			import('./modules/resultados/resultados.module').then(
				(mod) => mod.ResultadosModule
			),
	},
	{
		path: 'evaluaciones',
		canLoad: [LoginGuard],

		data: {
			roles: ['PUBLIC'],
		},
		loadChildren: () =>
			import('./modules/evaluaciones/evaluaciones.module').then(
				(mod) => mod.EvaluacionesModule
			),
	},
	{
		path: 'catalog',
		canLoad: [LoginGuard],

		data: {
			roles: ['PUBLIC'],
		},
		loadChildren: () =>
			import('./modules/catalogs/catalog.module').then(
				(mod) => mod.CatalogModule
			),
	},
	{
		//?: Nombre correcto?
		path: 'test',
		component: AppComponent,
	},
	{
		path: '',
		canLoad: [LoginGuard],

		data: {
			roles: ['PUBLIC'],
		},
		loadChildren: () =>
			import('./modules/public/public.module').then((mod) => mod.PublicModule),
	},
	//*Redireccionar a public en caso de ruta erronea
	/* {
    path: '**',
    redirectTo: '/',
  }, */
	//*Cargar 404 con enlace a public
	{
		path: '**',
		component: Error404Component,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	providers: [
		LoginGuard,
		JwtHelperService,
		{ provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
