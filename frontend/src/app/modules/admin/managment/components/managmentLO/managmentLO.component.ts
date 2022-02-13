import { Component, OnInit } from '@angular/core';
import { TrabajadoresService } from 'services/data';
import { ITrabCCompCContrDTO } from 'sharedInterfaces/DTO';

@Component({
	selector: 'app-managmentLO',
	templateUrl: 'managmentLO.component.html',
})
export class ManagmentLO implements OnInit {
	data = { workers: [] as ITrabCCompCContrDTO[] };
	constructor(private readonly wrkSv: TrabajadoresService) {}

	ngOnInit(): void {
		(async () => {
			this.data.workers = await this.wrkSv.getAll();
		})();
	}
}
