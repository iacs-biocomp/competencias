import { Component, OnInit } from '@angular/core';
import { Roles } from 'sharedInterfaces/Entity';
import { LoginGuard } from 'src/app/guards/login.guard';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
	/** Variable usada para mostrar o no los menus del administrador */
	isAdmin = false;
	collapsed = false;
	constructor(private loginGuard: LoginGuard) {}

	ngOnInit(): void {
		// LOG:
		this.isAdmin = this.loginGuard.hasRole(Roles.ADMIN);
	}

	collapse(): void {
		// LOG:
		this.collapsed = !this.collapsed;
		console.log(this.collapsed);
	}
}
