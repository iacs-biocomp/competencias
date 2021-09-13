import { Component, OnInit } from '@angular/core';
import { IUser } from 'sharedInterfaces/Entity';
import { JwtService } from 'src/app/services/auth/jwt.service';
import { UserDataService } from '../user-data.service';

@Component({
	selector: 'app-mis-datos',
	templateUrl: './mis-datos.component.html',
	styleUrls: ['./mis-datos.component.scss'],
})
export class MisDatosComponent implements OnInit {
	userData?: IUser;

	constructor(private usrDataService: UserDataService, private jwtServ: JwtService) {}

	async ngOnInit(): Promise<void> {
		this.userData = await this.usrDataService.getUserData(this.jwtServ.getDecodedToken().username);
		// LOG: datos del usuario obtenidos ${this.userData}
	}
}
