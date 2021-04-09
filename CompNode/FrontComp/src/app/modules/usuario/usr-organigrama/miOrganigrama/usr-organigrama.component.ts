import { Component, OnInit } from '@angular/core';
import { IOrganigramaTrabajador } from '../../../../../../../interfaces/IOrganigrama';
import { UsrOrganigramaService } from '../usr-organigrama.service';

@Component({
	selector: 'app-usr-organigrama',
	templateUrl: './usr-organigrama.component.html',
	styleUrls: ['./usr-organigrama.component.css'],
})
export class UsrOrganigramaComponent implements OnInit {
	miOrganigramaData!: IOrganigramaTrabajador;

	constructor(private orgService: UsrOrganigramaService) {}

	async ngOnInit(): Promise<void> {
		this.miOrganigramaData = await this.orgService.organigramaUsr();
	}
}
