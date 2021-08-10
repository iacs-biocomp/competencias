import { ICatComp, ICompetencia, IComportamiento, INivel } from '.';

/**
 * Represents an evaluation, have the same structure as backend entity.
 * Only should be used for create DTOs with same properties types.
 *
 * @author aml360 <aml360esp@gmail.com>
 *
 */
export interface IEvaluacion {
	id: number;
	/** Description of the evaluation */
	description: string;
	/** El modelo que usa la evaluación (Donde se indican competencias comportamientos y niveles) */
	model?: IEvModel;
	/** CatComp associated to evaluation */
	catComp?: ICatComp;
	/** Starting evaluation date */
	iniDate: Date;
	finPropuestas: Date;

	iniValidacion: Date;
	endValidacion: Date;

	iniValoracion: Date;
	endValoracion: Date;

	iniPerEvaluado: Date;
	endPerEvaluado: Date;
	//TODO: Tsdoc
	organiDate: Date;
	/** If the property is `true`, users will be able to access the results of their evaluation */
	isShowingResults?: boolean;
}

/**
 * Represents an evaluation model, have the same structure as backend entity.
 * Only should be used for create DTOs with same properties types.
 *
 * TODO: explain what is an evaluation model, and how is used.
 *
 * @author aml360 <aml360esp@gmail.com>
 *
 */
export interface IEvModel {
	id: number;
	catComp: ICatComp;
	reference: boolean;
	evs?: IEvaluacion[];
	/**
	 * Representa los submodelos del modelo que utiliza la evaluación
	 * @see {@link ISubModel}
	 */
	subModels?: ISubModel[];
}

/**
 * El submodelo representa el array de comportamientos que un nivel de una competencia posee,
 * tiene la misma estructura que la entidad en el backend
 * y solo se debería usar para crear nuevos tipos como los DTO
 *
 * @author aml360 <aml360esp@gmail.com>
 *
 */
export interface ISubModel {
	id?: number;
	/** Los modelos a los que pertenece este SubModelo, puede ser undefined si la petición es desde el modelo o no se carga la relación del modelo */
	modelos?: IEvModel[];

	// TODO: Tsdoc
	nivel: INivel;

	// TODO: Tsdoc
	competencia: ICompetencia;
	// TODO: Tsdoc
	comportamientos: IComportamiento[];

	nivelDescription?: string;
}
