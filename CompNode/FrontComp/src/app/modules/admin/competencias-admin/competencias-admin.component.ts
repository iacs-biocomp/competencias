import { Component, OnInit } from '@angular/core';
import { ICompetencia } from '../../../../../../interfaces/IEvaluaciones';
import { UserDataService } from '../../usuario/datos/user-data.service';

@Component({
	selector: 'app-competencias-admin',
	templateUrl: './competencias-admin.component.html',
	styleUrls: ['./competencias-admin.component.css'],
})
export class CompetenciasAdminComponent implements OnInit {
	competencias: ICompetencia[] = [{ id: "C1", descripcion: 'Comportamiento ético' },
																 { id: "C2", descripcion: 'Responsabilidad' }];

	constructor(private usrDataService: UserDataService) {}

	ngOnInit(): void {}
}
