import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { LoginGuard } from '../guards/login.guard';
import { SessionComponent } from './session/session.component';
import { JwtService } from '../services/jwt.service';
import { BaseLayoutComponent } from './layout/base/base-layout.component';

@NgModule({
	declarations: [MenuComponent, SessionComponent, BaseLayoutComponent],
	//Importar RouterModule sino el menu no funciona
	imports: [CommonModule, RouterModule],
	exports: [MenuComponent, SessionComponent],
	providers: [LoginGuard, JwtService],
})
export class SharedModule {}
