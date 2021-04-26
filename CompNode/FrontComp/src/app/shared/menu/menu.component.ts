import { Component, OnInit } from '@angular/core';
import { LoginGuard } from 'src/app/guards/login.guard';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
	/** Variable usada para mostrar o no los menus del administrador */
	isAdmin = false;
	collapsed = false;
	constructor(private loginGuard: LoginGuard) {}

	ngOnInit(): void {
		this.isAdmin = this.loginGuard.hasRole('ADMIN');
	}
	collapse(): void {
		this.collapsed = !this.collapsed;
		console.log(this.collapsed);
	}
}
