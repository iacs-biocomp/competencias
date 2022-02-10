import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { LoginGuard } from '../guards/login.guard';
import { SessionComponent } from './session/session.component';
import { JwtService } from '../services/auth/jwt.service';
import { BaseLayoutComponent } from './layout/base/base-layout.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';

@NgModule({
	//Importar RouterModule sino el menu no funciona
	imports: [CommonModule, RouterModule],
	declarations: [MenuComponent, SessionComponent, BaseLayoutComponent, EmptyStateComponent],
	exports: [MenuComponent, SessionComponent, BaseLayoutComponent, EmptyStateComponent],
	providers: [LoginGuard, JwtService],
})
export class SharedModule {}
