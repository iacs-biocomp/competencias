// Estas interfaces pueden cambiar, si se modifican y
// el cambio produce incompatibilidad, se deja en desuso con @deprecated y se genera una nueva

import { ICompetencia, IComportamiento, IEvaluacion, ITrabajador, IValoracion } from '../Entity';

/** Tipo usado para crear una nueva evaluación, SOLO en el endpoint POST /nest/valoraciones */
export type IValoracionAddDTO = Pick<IValoracion, 'valoracion'> & {
	evaluador: ITrabajador['dni'];
	/** El trabajador evaluado */
	evaluado: ITrabajador['dni'];
	/** La evaluación a la que corresponde esta valoración */
	ev: IEvaluacion['id'];
	/** La competencia que junto con el comportamiento hacen la valoracion */
	comp: ICompetencia['id'];
	/** El comportamiento valorado */
	comport: IComportamiento['id'];
};

/**
 *
 *
 * @example
 * ```ts
 * const exampleValoracionDto: IValoracionDTO = {
 *	evaluadorDni: '321231231D',
 *	evaluadoDni: '712894789D',
 *	valoraciones: [
 *		{
 *			compId: 'C1',
 *			puntuaciones: [
 *				{
 *					comportId: 'Co1',
 *					puntuacion: 5,
 *				},
 *				{
 *					comportId: 'Co1',
 *					puntuacion: 5,
 *				},
 *			],
 *		},
 *		{
 *			compId: 'C2',
 *			puntuaciones: [
 *				{
 *					comportId: 'Co1',
 *					puntuacion: 5,
 *				},
 *			],
 *		},
 *	],
 * };
 * ```
 *  @author aml360 <aml360esp@gmail.com>
 */
export interface IValoracionDTO {
	/** Es el dni del que emite la valoracion */ //! Posible cambio a username en vez de evaluadorDni
	evaluadorDni: string;
	/** Es el dni del trabajador que es evaluado */
	evaluadoDni: string;
	/** Array de valoraciones, tiene una competencia y un array de comportamientos */
	valoraciones: Array<{
		compId: string;
		puntuaciones: Array<{
			/** Es el identificador del comportamiento que se valora */
			comportId: string;
			/** Es la puntuacion que se le da al comportamiento de esa competencia */
			puntuacion: number; //! Posible cambio de nombre
		}>;
	}>;
}

/**
 * Interfaz de las valoraciones con indices, mas simple para mostrar datos, comprobar posibles undefined al dar keys que no esten en el objeto.
 * @example
 * ```ts
 * const exampleValoracionIndxDto: IValoracionIndexadaDTO = {
 *	evaluadorDni: '321231231D',
 *	evaluadoDni: '712894789D',
 *	valoraciones: {
 *		C1: {
 *			Co1: 5,
 *			Co3: 1,
 *			Co5: 4,
 *		},
 *		C2: {
 *			Co1: 2,
 *			Co2: 1,
 *		},
 *	},
 *};
 * ```
 *  @author aml360 <aml360esp@gmail.com>
 *
 */
export interface IValoracionIndexadaDTO {
	/** Es el dni del que emite la valoracion */ //! Posible cambio a username en vez de evaluadorDni
	evaluadorDni: string;
	/** Es el dni del trabajador que es evaluado */
	evaluadoDni: string;
	/** Array de valoraciones, tiene una competencia y un array de comportamientos */
	valoraciones: {
		[compId: string]: {
			/** Es el identificador del comportamiento que se valora */
			[comportId: string]: number;
		};
	};
}
