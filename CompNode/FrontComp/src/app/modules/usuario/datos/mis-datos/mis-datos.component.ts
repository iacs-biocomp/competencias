import { Component, OnInit } from '@angular/core';
import { IUserJson } from '../../../../../../../interfaces/IUser';
import { UserDataService } from '../user-data.service';

@Component({
	selector: 'mis-datos',
	templateUrl: './mis-datos.component.html',
	styleUrls: ['./mis-datos.component.css'],
})
export class MisDatosComponent implements OnInit {
	userData!: IUserJson;

	constructor(private usrDataService: UserDataService) {}

	async ngOnInit(): Promise<void> {
		this.userData = await this.usrDataService.getUserData('TEST');
		console.log(this.userData);
	}
}
