import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IAuthLogin } from '../auth.intefaces';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	/**URL previa, por defecto es `/`, tiene que cambiarse en ngOnInit y pasar la url en el guard*/
	returnUrl: string;
	loginForm!: FormGroup;

	constructor(
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute,
		private fb: FormBuilder
	) {
		this.returnUrl = '/';
	}

	/**
	 * Funcion para enviar el formulario, si el backend devuelve un error se notifica al usuario con un `alert`
	 */
	async sendForm() {
		let username: string = this.loginForm.controls['username'].value;
		let password: string = this.loginForm.controls['password'].value;
		if (username && password) {
			const body: IAuthLogin = {
				username: username,
				password: password,
			};
			try {
				await this.authService.sendLoginInfo(body);
				this.router.navigate([this.returnUrl]);
			} catch (error) {
				this.loginForm.reset();
				alert('Contraseña y/o Usuario incorrectos');
			}
		}
	}
	ngOnInit(): void {
		this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
		//Creacion formulario (Añadir aqui validaciones)
		this.loginForm = this.fb.group({
			username: '',
			password: '',
		});

		//Pasar usuario a mayusculas
		let username = this.loginForm.controls.username;
		username.valueChanges.subscribe((value: string) => {
			//Añadido if para evitar error al form.reset()
			if (value != null) {
				username.setValue(value.toUpperCase(), { emitEvent: false });
			}
		});
	}
}
