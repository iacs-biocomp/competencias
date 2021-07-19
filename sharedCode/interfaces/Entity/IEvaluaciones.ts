import { ICatComp } from './ICategorias';

/**
 * Interfaz que representa la información basica de una evaluación, tiene la misma estructura que la entidad en el backend
 * y solo se debería usar para crear nuevos tipos como los DTO
 *
 * @param Url /nest/evaluaciones/$USER (Username como parametro)
 */
export interface IEvaluacion {
	/** El id de la evaluación */
	id: number;
	/** La descripción de la evaluación */
	description: string;
	/** El modelo que usa la evaluación (Donde se indican competencias comportamientos y niveles) */
	model?: IEvModel;
	/** La categoría competencial de la evaluación */
	catComp?: ICatComp;
	//TODO:Tsdoc
	iniDate?: Date;
	finPropuestas?: Date;

	iniValidacion?: Date;
	endValidacion?: Date;

	iniValoracion?: Date;
	endValoracion?: Date;

	iniPerEvaluado?: Date;
	endPerEvaluado?: Date;
}

/**
 * TODO: Tsdoc
 * tiene la misma estructura que la entidad en el backend
 * y solo se debería usar para crear nuevos tipos como los DTO
 */
export interface IEvModel {
	id: number;
	// TODO: Tsdoc
	catComp: ICatComp;
	evs?: IEvaluacion[];
	/**
	 * Representa los submodelos del modelo que utiliza la evaluación
	 * @see {@link ISubModel}
	 */
	subModels?: ISubModel[];
}

/** El submodelo representa el array de comportamientos que un nivel de una competencia posee, tiene la misma estructura que la entidad en el backend
 * y solo se debería usar para crear nuevos tipos como los DTO */
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
}

/** Representa un nivel, tiene la misma estructura que la entidad en el backend
 * y solo se debería usar para crear nuevos tipos como los DTO */
export interface INivel {
	// TODO: Tsdoc
	id: number;
	// TODO: Tsdoc
	code: string;
	/** El valor del nivel como float */
	valor: number;
	// TODO: Tsdoc
	minRango: number;
	// TODO: Tsdoc
	maxRango: number;
	/** Los submodelos asociados a este nivel, en la mayoría de los casos esta propiedad será undefined */
	subModels?: ISubModel[];
}

/** Representa un comportamiento, tiene la misma estructura que la entidad en el backend
 * y solo se debería usar para crear nuevos tipos como los DTO */
export interface IComportamiento {
	// TODO: Tsdoc con ejemplos de posibles id de comports
	id: string;
	// TODO: Tsdoc
	descripcion: string;
	/** Los submodelos asociados a este comportamiento, en la mayoría de los casos esta propiedad será undefined */
	subModels?: ISubModel[];
}

/** Representa una competencia, tiene la misma estructura que la entidad en el backend
 * y solo se debería usar para crear nuevos tipos como los DTO */
export interface ICompetencia {
	// TODO: Tsdoc con ejemplos de posibles id de comps
	id: string;
	// TODO: Tsdoc
	descripcion: string;
	// TODO: Tsdoc
	createdAt: Date;
	// TODO: Tsdoc
	subModels?: ISubModel[];
}
