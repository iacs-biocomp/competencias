import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NgModuleRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { HttpConfigInterceptor } from './guards/httpconfig.interceptor';
import { SharedModule } from './shared/shared.module';
import { Error404Component } from './modules/app/error404/error404.component';

//Usado para tener fechas y monedas en castellano
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs);

// function initializeKeycloak(keycloak: KeycloakService) {
// 	return () =>
// 		keycloak.init({
// 			config: {
// 				url: 'http://1.44.4.7/auth',
// 				realm: 'bigan',
// 				clientId: 'investigacion-front',
// 			},
// 			loadUserProfileAtStartUp: false,
// 			initOptions: {
// 				// https://www.npmjs.com/package/keycloak-angular
// 				// onLoad: 'check-sso',
// 				silentCheckSsoRedirectUri:
// 					window.location.origin + '/assets/silent-check-sso.html',
// 			},
// 		});
// }
@NgModule({
	declarations: [AppComponent, Error404Component],
	imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, HttpClientModule, SharedModule],
	providers: [
		// HttpConfigInterceptor
		// KeycloakService,
		// {
		//   provide: APP_INITIALIZER,
		//   useFactory: initializeKeycloak,
		//   multi: true,
		//   deps: [KeycloakService],
		// },
	],
	exports: [SharedModule],
	bootstrap: [AppComponent],
})
export class AppModule {
	constructor(private m: NgModuleRef<AppModule>) {}

	/**
	 * Destruye el modulo de app y sus childrens, usar solo para el logout
	 */
	// destory() {
	// 	this.m.destroy();
	// }
}
