import { ICatComp } from './ICategorias';

/**
 * Interfaz que representa la información basica de una evaluación.
 *
 * @param Url /nest/evaluaciones/$USER (Username como parametro)
 */
export interface IEvaluacion {
	/** El id como string de la evaluación */
	id: string;
	/** La descripción de la evaluación */
	description: string;
	/** El modelo que usa la evaluación (Donde se indican competencias comportamientos y niveles) */
	model?: IEvModel;
	/** La categoría competencial de la evaluación */
	catComp?: ICatComp;

	iniDate?: Date;
	finPropuestas?: Date;

	iniValidacion?: Date;
	endValidacion?: Date;

	iniValoracion?: Date;
	endValoracion?: Date;

	iniPerEvaluado?: Date;
	endPerEvaluado?: Date;
}

export interface IEvModel {
	id: string;
	catComp: ICatComp | undefined;
	evs?: IEvaluacion[];
	/**
	 * Representa los submodelos del modelo que utiliza la evaluación
	 * @see {ISubModel}
	 * {@link ISubModel|link text}
	 */
	subModels?: ISubModel[];
}
/** El submodelo representa el array de comportamientos que un nivel de una competencia posee */
export interface ISubModel {
	/** Los modelos a los que pertenece este SubModelo, puede ser undefined si la petición es desde el modelo o no se carga la relación del modelo */
	modelos?: IEvModel[];

	nivel: INivel;

	competencia: ICompetencia;

	comportamientos: IComportamiento[];
}
/** Representa un nivel, tiene la misma estructura que el que tiene el backend */
export interface INivel {
	id: number;
	/**  */
	code: string;
	/** El valor del nivel como float */
	valor: number;
	minRango: number;
	maxRango: number;
	/** Los submodelos asociados a este nivel, en la mayoría de los casos esta propiedad será undefined */
	subModels?: ISubModel[];
}

/** Representa un comportamiento, tiene la misma estructura que el que tiene el backend */
export interface IComportamiento {
	id: string;

	descripcion: string;
	/** Los submodelos asociados a este comportamiento, en la mayoría de los casos esta propiedad será undefined */
	subModels?: ISubModel[];
}
/** Representa una competencia, tiene la misma estructura que el que tiene el backend */
export interface ICompetencia {
	id: string;
	descripcion: string;
	createdAt?: Date;
}
