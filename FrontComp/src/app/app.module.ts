import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { Error404Component } from './modules/app/error404/error404.component';

//Usado para tener fechas y monedas en castellano
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
registerLocaleData(localeEs);

@NgModule({
	declarations: [AppComponent, Error404Component],
	imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, HttpClientModule, SharedModule],
	exports: [SharedModule],
	providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
	bootstrap: [AppComponent],
})
export class AppModule {}