import { Component, OnInit } from '@angular/core';
import { ICatComp } from '../../../../../../interfaces/ICategorias';
import { ICompetencia, ISubModel } from '../../../../../../interfaces/IEvaluaciones'
import { ModelosService } from './services/modelos.service'

@Component({
  selector: 'app-modelos',
  templateUrl: './modelos.component.html',
  styleUrls: ['./modelos.component.css']
})
export class ModelosComponent implements OnInit {
  constructor(private modelService: ModelosService) {}

	subModelToAdd!: ISubModel;

	catComps!: ICatComp[];
	competen!: ICompetencia[];
	subModel!: ISubModel[];
	public selectedOption!: boolean;

  async ngOnInit(): Promise<void> {
		this.listCatComp();
		this.listCompeten();
		this.listSubModel();
		this.selectedOption = false;
  }

	async listCatComp(): Promise<void> {
		this.catComps = await this.modelService.getAllCatComp();
	}

	async listCompeten(): Promise<void> {
		this.competen = await this.modelService.getAllCompeten();
	}

	async listSubModel(): Promise<void> {
		this.subModel = await this.modelService.getAllSubModel();
	}

	/* Cuando se pulsa una opcion la ventana hace scroll hasta el botón de 'siguiente'*/
	scrollToButton(element: HTMLElement) {
    element.scrollIntoView();
		this.selectedOption = true;
	}
}
