import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
	enableProdMode();
}
if(environment.isApiUrlDynamic){
	environment.apiURL = `${location.origin}${environment.apiURLtoAdd}`;
}
platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch(err => console.error(err));
