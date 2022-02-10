import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginGuard } from 'src/app/guards/login.guard';
import { JwtService } from 'src/app/services/auth/jwt.service';
import { LogService } from '../log/log.service';

@Component({
	selector: 'app-session',
	templateUrl: './session.component.html',
	styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit {
	username!: string;
	isDataLoaded = false;

	constructor(
		private readonly jwtService: JwtService,
		private readonly router: Router,
		private readonly logger: LogService,
	) {}

	ngOnInit(): void {
		this.logger.verbose(`Loading ${this.constructor.name}`);
		const decodedTkn = this.jwtService.getDecodedToken();
		if (!!decodedTkn) {
			this.username = decodedTkn.username;
			this.isDataLoaded = true;
		}
	}

	// TODO: Translate tsdoc to english
	/** Función que cierra sesión (Borra el token de las cookies y localStorage), redirige al login y recarga la pagina */
	closeSession(): void {
		this.jwtService.rmToken();
		this.logger.verbose(`Session closed, navigating to ${LoginGuard.loginRoute}`);
		this.router.navigate([LoginGuard.loginRoute]);
		//Recarga la página para asi no tener problemas con el cache de la aplicación
		this.logger.verbose('Reloading the page');
		location.reload();
	}
}
