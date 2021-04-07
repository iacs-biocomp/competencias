import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ICatalog, IDataset, IMaster } from './catalogs/catalog.interface';
import { OrientService } from './catalogs/orient.service';

@Component({
	selector: 'catalog-component',
	templateUrl: 'catalog.component.html',
	styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
	constructor(private orient: OrientService) {}
	catalogs!: ICatalog;
	dataset!: Array<IDataset>;
	master!: Array<IMaster>;
	dataSource!: Array<IDataset>;
	displayedColumns = ['name', 'description', 'from_dt', 'to_dt', 'recNumber'];
	titles: string[] = ['Nombre', 'Descripción', 'N° Registros', 'Desde', 'Hasta'];
	testData: IDataset[] = [
		{
			name: 'mf_cias_zona',
			description: 'Relación de CIAS y Zonas de Salud',
			from_dt: new Date(2019, 1, 1),
			to_dt: new Date(2019, 1, 1),
			recNumber: 2098,
		},
		{
			name: 'mf_cie9',
			description: 'Diagnósticos y procedimientos CIE-9-MC',
			from_dt: new Date(2019, 1, 1),
			to_dt: new Date(2019, 1, 1),
			recNumber: 22735,
		},
	];
	@ViewChild(MatTable)
	myTable!: MatTable<any>;

	ngOnInit(): void {
		this.orient.getPublicCatalogs().then(catalogs => {
			this.catalogs = catalogs;
			this.dataset = catalogs.dataset;
			this.master = catalogs.master;
			this.dataSource = this.dataset;
		});
	}
}
