import { IEvaluacion, IEvModel, IPeriodoTrab } from '.';

export interface ICatComp {
	id: string;
	description: string;
	/**Es la categoria contractual "Por defecto". Es decir a que categoría competencial corresponde esta contractual en ESTE MOMENTO*/
	catContr?: ICatContr[];
	periodosTrab?: IPeriodoTrab[];
	models?: IEvModel[];
	evaluaciones?: IEvaluacion[];
}

export interface ICatContr {
	/** Identificador de la categoria contractual, por ejemplo: GR1 */
	id: string;
	description: string;
	/**Es la categoria competencial "Por defecto". Es decir a que categoría competencial corresponde esta contractual en ESTE MOMENTO*/
	catComp?: ICatComp;
}
