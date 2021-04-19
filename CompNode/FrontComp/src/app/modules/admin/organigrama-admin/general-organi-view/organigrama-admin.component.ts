import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IOrganigramaUsrDTO, ITrabOrgani } from '../../../../../../../interfaces/DTO/ITrabajadorDTO';
import { OrganiService } from '../services/organi.service';

@Component({
	selector: 'app-organigrama-admin',
	templateUrl: './organigrama-admin.component.html',
	styleUrls: ['./organigrama-admin.component.css'],
})
export class OrganiGeneralView implements OnInit {
	fullOrgani!: IOrganigramaUsrDTO[];
	/** Lista de los trabajadores que hay en el fullOrgani*/
	trabajadores!: ITrabOrgani[];
	trabajadoresFiltered!: ITrabOrgani[];
	myControl = new FormControl();
	orgFilter = '';
	showall = false;
	constructor(private orgSv: OrganiService) {}

	async ngOnInit(): Promise<void> {
		this.fullOrgani = await this.orgSv.getFullOrgani();
		this.trabajadores = this.fullOrgani.map(org => org.trabajador);
		this.trabajadoresFiltered = this.trabajadores;
		setInterval(() => {
			console.log(this.orgFilter);
		}, 3500);
	}
	// filterTrabList(value: string): void {
	// 	const filterValue = value.toLowerCase();
	// 	this.trabajadoresFiltered = this.trabajadoresFiltered.filter(
	// 		trab =>
	// 			trab.nombre.toLowerCase().includes(filterValue) || trab.apellidos.toLowerCase().includes(filterValue),
	// 	);
	// }

	scroll(id: string) {
		const element = document.getElementById(id);
		element?.classList.add('highlight');
		element?.scrollIntoView();
		setTimeout(() => {
			element?.classList.remove('highlight');
		}, 1500);
	}
	filterOrgani(value: string): IOrganigramaUsrDTO[] {
		const filterValue = value.toLowerCase();
		return this.fullOrgani?.filter(
			org =>
				org.trabajador.nombre.toLowerCase().includes(filterValue) ||
				org.trabajador.apellidos.toLowerCase().includes(filterValue),
		);
	}
}
