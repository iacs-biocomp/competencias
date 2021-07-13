import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { SignInDto } from 'sharedInterfaces/DTO';

enum ServerErrorsLogin {
	NotConnected = 0,
	Unauthorized = 401,
}
type ServerResponse = {
	status: ServerErrorsLogin;
};

/** Formulario extendido para forzar los tipos de los value de los controles */
type ExtFormGroup = FormGroup & {
	controls: {
		// TODO: Comprobar si puede ser (| null) o solo string
		username: Omit<AbstractControl, 'value'> & { value: string | null };
		password: Omit<AbstractControl, 'value'> & { value: string | null };
	};
};
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	/**URL previa, por defecto es `/`, tiene que cambiarse en ngOnInit y pasar la url en el guard*/
	returnUrl: string = '/';
	loginForm!: ExtFormGroup;

	constructor(
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute,
		private fb: FormBuilder,
	) {}

	ngOnInit(): void {
		this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
		//Creacion formulario (Añadir aqui validaciones)
		this.loginForm = this.fb.group({
			username: '',
			password: '',
		}) as ExtFormGroup;

		//Pasar usuario a mayusculas
		const username = this.loginForm.controls.username;
		username.valueChanges.subscribe((value: string) => {
			//Añadido if para evitar error al form.reset()
			if (value != null) {
				username.setValue(value.toUpperCase(), { emitEvent: false });
			}
		});
	}

	/**
	 * Funcion para enviar el formulario, si el backend devuelve un error se notifica al usuario con un `alert`
	 */
	async sendForm() {
		const username = this.loginForm.controls.username.value;
		const password = this.loginForm.controls.password.value;
		if (username && password) {
			const body: SignInDto = {
				username,
				password,
			};
			try {
				await this.authService.sendLoginInfo(body);
				this.router.navigate([this.returnUrl]);
			} catch (error: unknown) {
				let err = error as ServerResponse;
				if (err.status === ServerErrorsLogin.NotConnected) {
					console.log('No se ha podido conectar con el servidor');
				} else {
					console.log('Contraseña y/o Usuario incorrectos');
				}

				// TODO: Usar en los errores https://is.gd/zecX4U
				console.log(error);
				this.loginForm.reset();
				// TODO: Mirar el tipo de error e imprimir una u otra cosa según el error
				// (Timed out/ Connection refused/ JWT expired/ Invalid password)
				// TODO: Tal vez crear un servicio o algo que active un componente (Modal) que este en el layout y ahi mostrar mensajes tipo alert
				alert('Contraseña y/o Usuario incorrectos');
			}
		}
	}
}
