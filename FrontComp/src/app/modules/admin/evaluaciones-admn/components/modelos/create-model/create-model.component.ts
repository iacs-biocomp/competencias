import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
	CatCompetencialesService,
	CompetenciasService,
	NivelService,
	ComportService,
	EvModelsAdmnService,
} from 'services/data';
import { deleteProps, findSubModelByCompNiv, findSubModels, getAllComportsOfComp } from 'sharedCode/Utility';
import { ICCompDTO, ICompGetDTO, IComportGetDTO, IEvModelGetDTO, INivelGetDTO } from 'sharedInterfaces/DTO';
import { LogService } from 'src/app/shared/log/log.service';

/**
 * Componente dedicado a crear un nuevo modelo usado para las evaluaciones
 */
@Component({
	selector: 'app-create-model [modalId]',
	templateUrl: './create-model.component.html',
	styleUrls: ['./create-model.component.scss'],
})
export class CreateModelComponent implements OnInit, OnDestroy {
	@ViewChild('closeCreateModel') closeModalBtn!: ElementRef<HTMLButtonElement>;
	@ViewChild('selectCatComp') selectCatComp!: ElementRef<HTMLSelectElement>;
	@Input() modalId!: string;
	/** Control view, object that is only used to control the view's behaviour, animations and style the component */
	cv = {
		isCCompSelected: false,
	};

	dbData = {
		cComps: [] as ICCompDTO[],
		comps: [] as ICompGetDTO[],
		nivs: [] as INivelGetDTO[],
		comports: [] as IComportGetDTO[],
		refModels: [] as IEvModelGetDTO[],
	};

	isAllDataLoaded = false;
	model = new BehaviorSubject<IEvModelGetDTO>({
		reference: true,
		catComp: {} as ICCompDTO,
		id: -1,
		subModels: [],
	});

	constructor(
		private readonly cCompSv: CatCompetencialesService,
		private readonly competSv: CompetenciasService,
		private readonly nivSv: NivelService,
		private readonly comportSv: ComportService,
		private readonly evModelSv: EvModelsAdmnService,
		private readonly logSv: LogService,
	) {}

	async ngOnInit(): Promise<void> {
		const [cComps, comps, nivs, comports, refModels] = await Promise.all([
			this.cCompSv.getAll(),
			this.competSv.getAll(),
			this.nivSv.getAllRefNivs(),
			this.comportSv.getAll(),
			this.evModelSv.getAllReference(),
		]);
		[this.dbData.cComps, this.dbData.comps, this.dbData.nivs, this.dbData.comports, this.dbData.refModels] = [
			cComps,
			comps,
			nivs,
			comports,
			refModels,
		];
		this.isAllDataLoaded = true;
	}

	ngOnDestroy(): void {
		this.closeModalBtn.nativeElement.click();
	}

	findSubModelByCompNiv = findSubModelByCompNiv;
	findSubModels = findSubModels;
	getAllComportsOfComp = getAllComportsOfComp;

	/**
	 * @returns The catComps that doesn't have a reference model in the database yet.
	 */
	getCCompsWithoutRefModel(): ICCompDTO[] {
		return this.dbData.cComps.filter(
			cComp => !this.dbData.refModels.find(refModel => refModel.catComp.id === cComp.id),
		);
	}

	setCatCompSelected(): void {
		const cCompId = this.selectCatComp.nativeElement.value;
		const cComp = this.dbData.cComps.find(catComp => catComp.id === cCompId);
		if (!cComp) {
			const errMsg = 'CreateModelComponent tiene errores con las catComps y sus ids';
			const err = new Error(errMsg);
			this.logSv.error(errMsg, { cCompId, cComp });
			throw err;
		}
		const model: IEvModelGetDTO = {
			reference: true,
			catComp: cComp,
			id: -1,
			subModels: [],
		};
		this.cv.isCCompSelected = true;
		this.model.next(model);
	}

	saveNewRefModel(model: IEvModelGetDTO) {
		console.log(model.id);
		model.reference = true;
		const newRefModel = deleteProps(model, ['id']);
		console.log(newRefModel);
		this.evModelSv.save(newRefModel, true);
	}
}
