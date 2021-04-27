import { Component, OnInit } from '@angular/core';
import * as Aos from 'aos';
import { JwtService } from './services/jwt.service';
// import { environment as cnf } from 'src/environments/environment';
// import { remove as cookieRm } from 'js-cookie';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	title = 'Competencias';

	constructor(public jwtSv: JwtService) {}

	ngOnInit(): void {
		Aos.init({
			duration: 700,
			once: true,
		});
		this.eventsToken(() => {
			this.jwtSv.refreshEvent();
		});
		setInterval(() => {
			this.jwtSv.refreshToken();
		}, 15000);
	}

	/**
	 * Metodo que añade listeners a las interacciones del usuario con la aplicación,
	 * ejecuta una función en cada evento
	 * @param fn Función a ejecutar cuando ocurre un evento del usuario
	 */
	private eventsToken(fn: () => void) {
		document.addEventListener('keydown', fn);
		document.addEventListener('click', fn);
	}
}
