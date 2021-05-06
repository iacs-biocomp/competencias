import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { AuthService } from './auth.service';

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'register',
		component: RegisterComponent,
	},
];

@NgModule({
	declarations: [LoginComponent, RegisterComponent],
	imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule],
	providers: [AuthService],
})
export class AuthModule {}
