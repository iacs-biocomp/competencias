import { Component, Input, OnInit } from '@angular/core';
import { ICompetencia, INivel } from 'sharedInterfaces/Entity';
import { NivelService } from '../../../niveles-admin/services/nivel.service';

@Component({
  selector: 'app-model-nivel4-comp-select',
  templateUrl: './model-nivel4-comp-select.component.html',
  styleUrls: ['./model-nivel4-comp-select.component.css']
})
export class ModelNivel4CompSelectComponent implements OnInit {
	@Input() competenciasModelos!: ICompetencia[];

	niveles: INivel[] = [];

  constructor(private nivelSv: NivelService) {}

  async ngOnInit(): Promise<void> {
		if (!this.competenciasModelos)
		throw new Error('Debes elegir una competencia como mínimo');
		this.niveles = await this.nivelSv.getAll();
  }



}
