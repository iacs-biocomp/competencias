import { Component, OnInit } from '@angular/core';
import { IOrganigramaTrabajador } from 'sharedInterfaces/Entity';
import { UsrOrganigramaService } from '../usr-organigrama.service';

@Component({
	selector: 'app-usr-organigrama',
	templateUrl: './usr-organigrama.component.html',
	styleUrls: ['./usr-organigrama.component.scss'],
})
export class UsrOrganigramaComponent implements OnInit {
	miOrganigramaData: IOrganigramaTrabajador | undefined;

	constructor(private orgService: UsrOrganigramaService) {}

	async ngOnInit(): Promise<void> {
		// LOG: actualizando datos del organigrama del usuario
		this.miOrganigramaData = await this.orgService.organigramaUsr();
	}
}
