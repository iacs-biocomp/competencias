import { Component, OnInit } from '@angular/core';
import { ISubModel } from '../../../../../../interfaces/IEvaluaciones'
import { ModelosService } from './services/modelos.service'

@Component({
  selector: 'app-modelos',
  templateUrl: './modelos.component.html',
  styleUrls: ['./modelos.component.css']
})
export class ModelosComponent implements OnInit {
  constructor(private modelService: ModelosService) {}

	subModelToAdd!: ISubModel;


  async ngOnInit(): Promise<void> {
	//	this.updateModelosView();
  }


}
