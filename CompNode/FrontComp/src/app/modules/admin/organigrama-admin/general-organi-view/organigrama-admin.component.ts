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
	myControl = new FormControl();
	constructor(private orgSv: OrganiService) {}

	async ngOnInit(): Promise<void> {
		this.fullOrgani = await this.orgSv.getFullOrgani();
		this.trabajadores = this.fullOrgani.map(org => org.trabajador);
	}
	// private _filter(value: string): string[] {
	// 	const filterValue = value.toLowerCase();
	// 	return this.options.filter(option => option.toLowerCase().includes(filterValue));
	// }
}
