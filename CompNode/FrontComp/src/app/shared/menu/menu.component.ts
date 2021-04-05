import { Component, OnInit } from '@angular/core';
import { LoginGuard } from 'src/app/guards/login.guard';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
	constructor(private loginGuard: LoginGuard) {}
	/** Variable usada para mostrar o no los menus del administrador */
	isAdmin: boolean = false;
	clase: string = 'collapse';
	collapse(): void {}
	ngOnInit(): void {
		this.isAdmin = this.loginGuard.hasRole('ADMIN');
	}
}
