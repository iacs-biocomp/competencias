import { Component, OnInit } from '@angular/core';
import { IUserJson } from 'sharedInterfaces/Entity/IUser';
import { JwtService } from 'src/app/services/jwt.service';
import { UserDataService } from '../user-data.service';

@Component({
	selector: 'mis-datos',
	templateUrl: './mis-datos.component.html',
	styleUrls: ['./mis-datos.component.css'],
})
export class MisDatosComponent implements OnInit {
	userData?: IUserJson;

	constructor(private usrDataService: UserDataService, private jwtServ: JwtService) {}

	async ngOnInit(): Promise<void> {
		this.userData = await this.usrDataService.getUserData(this.jwtServ.getDecodedToken().username);
	}
}
