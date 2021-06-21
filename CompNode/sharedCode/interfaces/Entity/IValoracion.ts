import { ICompetencia, IComportamiento, IEvaluacion, ITrabajador } from '.';
//Se podría hacer una clase que tuviese el numero y comprobase
export type ValoracionesNums = 1 | 2 | 3 | 4 | 5;

export interface IValoracion {
	/** El id numerico autogenerado */
	id: number;
	/** La persona que evalua */
	evaluador: ITrabajador;
	/** El trabajador evaluado */
	evaluado: ITrabajador;
	/** La evaluación a la que corresponde esta valoración */
	ev: IEvaluacion;
	/** La competencia que junto con el comportamiento hacen la valoracion */
	comp: ICompetencia;
	/** El comportamiento valorado */
	comport: IComportamiento;
	/** La puntuación que se le da a esa comp&comport */
	valoracion: ValoracionesNums;
}
