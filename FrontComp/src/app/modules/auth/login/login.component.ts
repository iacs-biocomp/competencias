import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ISignInDto } from 'sharedInterfaces/DTO';
import { HttpErrorResponse } from '@angular/common/http';
import { LogService } from 'src/app/shared/log/log.service';
import { JwtService } from 'src/app/services/auth/jwt.service';

enum ServerErrorsLogin {
	NotConnected = 0,
	Unauthorized = 401,
}

/** Formulario extendido para forzar los tipos de los value de los controles */
type ExtFormGroup = FormGroup & {
	controls: {
		username: Omit<AbstractControl, 'value'> & { value: string | '' };
		password: Omit<AbstractControl, 'value'> & { value: string | '' };
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
		private readonly authService: AuthService,
		private readonly router: Router,
		private readonly route: ActivatedRoute,
		private readonly fb: FormBuilder,
		private readonly logger: LogService,
		private readonly jwtSv: JwtService,
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
		if (username !== '' && password !== '') {
			const body: ISignInDto = {
				username,
				password,
			};
			try {
				const tkn = await this.authService.sendLoginInfo(body);
				this.jwtSv.updateJwt(tkn.token);
				this.router.navigate([this.returnUrl]);
			} catch (error: unknown) {
				if (error instanceof HttpErrorResponse) {
					let msg: string = '';
					switch (error.status as typeof error.status & ServerErrorsLogin) {
						case ServerErrorsLogin.Unauthorized:
							msg = 'Contraseña y/o Usuario incorrectos';
							break;
						case ServerErrorsLogin.NotConnected:
							msg = 'No se ha podido conectar con el servidor';
							break;
						default:
							msg = 'Ha habido un error inesperado';
							break;
					}
					// TODO: Refactor, no es un error realmente user/password incorrecta
					this.logger.error(msg);
					alert(msg);
				}
				this.loginForm.reset();
				// TODO: Tal vez crear un servicio o algo que active un componente (Modal) que este en el layout y ahi mostrar mensajes tipo alert
			}
		} else {
			alert('Introduce un username y password');
		}
	}
}
