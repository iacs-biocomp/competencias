import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { AuthService } from './auth.service';
import { CompRoutes } from 'src/app/types/angular-modified-types';

const routes: CompRoutes = [
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'register',
		component: RegisterComponent,
	},
];

// TODO: Tsdoc del modulo
@NgModule({
	declarations: [LoginComponent, RegisterComponent],
	imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule],
	providers: [AuthService],
})
export class AuthModule {}
