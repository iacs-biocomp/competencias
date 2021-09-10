import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.IN_PRODUCTION) {
	enableProdMode();
}
if(environment.IS_API_URL_DYNAMIC){
	environment.API_URL = `${location.origin}${environment.API_URL_TO_ADD}`;
}
platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch(err => console.error(err));
