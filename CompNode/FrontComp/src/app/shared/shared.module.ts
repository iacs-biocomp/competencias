import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { LoginGuard } from '../guards/login.guard';

@NgModule({
	declarations: [MenuComponent],
	//Importar RouterModule sino el menu no funciona
	imports: [CommonModule, RouterModule],
	exports: [MenuComponent],
	providers: [LoginGuard],
})
export class SharedModule {}
