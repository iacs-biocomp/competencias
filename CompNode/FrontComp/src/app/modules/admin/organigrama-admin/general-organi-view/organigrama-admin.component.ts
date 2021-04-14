import { Component, OnInit } from '@angular/core';
import { IOrganigramaUsrDTO } from '../../../../../../../interfaces/DTO/ITrabajadorDTO';
import { OrganiService } from '../services/organi.service';

@Component({
	selector: 'app-organigrama-admin',
	templateUrl: './organigrama-admin.component.html',
	styleUrls: ['./organigrama-admin.component.css'],
})
export class OrganiGeneralView implements OnInit {
	fullOrgani!: IOrganigramaUsrDTO[];
	constructor(private orgSv: OrganiService) {}

	async ngOnInit(): Promise<void> {
		this.fullOrgani = await this.orgSv.getFullOrgani();
		console.log(this.fullOrgani);
	}
}
