import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginGuard } from 'src/app/guards/login.guard';
import { JwtService } from 'src/app/services/jwt.service';

@Component({
	selector: 'app-session',
	templateUrl: './session.component.html',
	styleUrls: ['./session.component.css'],
})
export class SessionComponent implements OnInit {
	constructor(private jwtService: JwtService, private router: Router) {}
	username: string = this.jwtService.getDecodedToken().username;

	ngOnInit(): void {
		this.username = this.jwtService.getDecodedToken().username;
	}
	/** Función que cierra sesión (Borra el token de las cookies y localStorage), redirige al login y recarga la pagina */
	closeSession(): void {
		this.jwtService.rmToken();
		this.router.navigate([LoginGuard.loginRoute]);
		//Recarga la página para asi no tener problemas con el cache de la aplicación
		location.reload();
	}
}
