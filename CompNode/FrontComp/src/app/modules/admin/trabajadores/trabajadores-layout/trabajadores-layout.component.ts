import { Component, OnInit } from '@angular/core';
import { TrabajadoresService } from '../services/trabajadores.service';

@Component({
	selector: 'app-trabajadores-layout',
	templateUrl: './trabajadores-layout.component.html',
	styleUrls: ['./trabajadores-layout.component.css'],
})
export class TrabajadoresLayoutComponent implements OnInit {
	constructor(private trabService: TrabajadoresService) {}

	ngOnInit(): void {}
}
