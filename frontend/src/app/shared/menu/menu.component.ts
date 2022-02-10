import { Component, OnInit } from '@angular/core';
import { Roles } from 'sharedInterfaces/Entity';
import { LoginGuard } from 'src/app/guards/login.guard';
import { LogService } from '../log/log.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
	/** Variable usada para mostrar o no los menus del administrador */
	isAdmin = false;
	collapsed = false;
	constructor(private readonly loginGuard: LoginGuard, private readonly logger: LogService) {}

	ngOnInit(): void {
		this.logger.verbose(`Loading ${this.constructor.name}`);
		this.isAdmin = this.loginGuard.hasRole(Roles.ADMIN);
	}

	collapse(): void {
		// this.logger.verbose(`${this.collapse.name} called`);
		this.collapsed = !this.collapsed;
		console.log(this.collapsed);
	}
}
