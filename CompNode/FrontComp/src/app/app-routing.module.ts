import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AppComponent } from './app.component';
import { LoginGuard } from './guards/login.guard';
import { Error404Component } from './modules/app/error404/error404.component';

const routes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('./modules/public/public.module').then((mod) => mod.PublicModule),
	},
	{
		path: 'catalog',
		loadChildren: () =>
			import('./modules/catalogs/catalog.module').then(
				(mod) => mod.CatalogModule
			),
	},
	{
		path: 'auth',
		loadChildren: () =>
			import('./modules/auth/auth.module').then((mod) => mod.AuthModule),
	},
	{
		path: 'activity',
		canLoad: [LoginGuard],
		data: {
			roles: ['ADMIN'],
		},
		loadChildren: () =>
			import('./modules/activity/activity.module').then(
				(mod) => mod.ActivityModule
			),
	},
	{
		path: 'data_req',
		loadChildren: () =>
			import('./modules/data-req/data-req.module').then(
				(mod) => mod.DataReqModule
			),
	},
	{
		//?: Nombre correcto?
		path: 'projects',
		loadChildren: () =>
			import('./modules/current-projects/current-projects.module').then(
				(mod) => mod.CurrentProjectsModule
			),
	},
	{
		//?: Nombre correcto?
		path: 'about',
		loadChildren: () =>
			import('./modules/about-page/about-page.module').then(
				(mod) => mod.AboutPageModule
			),
	},
	{
		//?: Nombre correcto?
		path: 'test',
		component: AppComponent,
	},
	{
		//?: Nombre correcto?
		path: 'sede_electronica',
		loadChildren: () =>
			import('./modules/sede-electronica/sede-electronica.module').then(
				(mod) => mod.SedeElectronicaModule
			),
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
