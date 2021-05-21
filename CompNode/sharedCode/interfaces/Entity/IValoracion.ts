import { ICompetencia, IComportamiento, IEvaluacion, ITrabajador } from '.';
//Se podría hacer una clase que tuviese el numero y comprobase
export type ValoracionesNums = 1 | 2 | 3 | 4 | 5;
export interface IValoracion {
	id: number;

	evaluador: ITrabajador;

	evaluado: ITrabajador;

	ev: IEvaluacion;

	/** La competencia que junto con el comportamiento hacen la valoracion */
	comp: ICompetencia;

	/** El comportamiento valorado */
	comport: IComportamiento;

	valoracion: ValoracionesNums;
}
