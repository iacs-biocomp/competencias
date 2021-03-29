import { Component, OnInit } from '@angular/core';
import { IUserJson } from '../../../../../../../interfaces/IUser';
import { UserDataService } from '../user-data.service';

@Component({
	selector: 'mis-datos',
	templateUrl: './mis-datos.component.html',
	styleUrls: ['./mis-datos.component.css'],
})
export class MisDatosComponent implements OnInit {
	//TODO: Hay que esperar a cargar los datos y entonces mostrarlos sino tira una excepción en consola (Aunque funciona)
	userData!: IUserJson;

	constructor(private usrDataService: UserDataService) {}

	async ngOnInit(): Promise<void> {
		//TODO: Parametrizar el nombre de usuario del cual se piden los datos, en el backend generar un guard para
		// pillar la cookie con el jwt y verificar que es admin o el mismo usuario q pide sus datos
		this.userData = await this.usrDataService.getUserData('TEST');
		console.log(this.userData);
	}
}
