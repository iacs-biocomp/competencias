import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [MenuComponent],
	//Importar RouterModule sino el menu no funciona
	imports: [CommonModule, RouterModule],
	exports: [MenuComponent],
})
export class SharedModule {}
