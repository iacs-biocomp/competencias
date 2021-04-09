import { Component, OnInit } from '@angular/core';
import { UsrOrganigramaService } from './usr-organigrama.service';

@Component({
	selector: 'app-usr-layoutOrganigrama',
	templateUrl: './organigrama.html',
	styleUrls: ['./organigrama.css']
})
export class LayoutOrgComponent implements OnInit {
	constructor(private orgService: UsrOrganigramaService) {}

	ngOnInit(): void {}
}
