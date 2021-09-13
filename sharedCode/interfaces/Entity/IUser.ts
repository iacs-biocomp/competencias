import { ICatComp, ICatContr } from './ICategorias';

export interface ITrabajador {
	dni: string;

	nombre: string;

	apellidos: string;
	// TODO: Tsdoc.
	area: string;
	/** La unidad a la que pertenece el trabajador */
	unidad: string;
	/** El departamento al que pertenece el trabajador */
	departamento?: string;
	/**
	 * Los periodos que tiene el trabajador, para mas información:
	 * @see {@link IPeriodoTrab}
	 */
	periodos?: IPeriodoTrab[];
	// TODO: Tsdoc.
	user?: IUser;
}

// TODO: Tsdoc.
export interface IPeriodoTrab {
	id: number;
	/** El trabajador al que corresponde este periodo */
	trabajador: ITrabajador;
	/** La categoria contractual que tiene el trabajador en este periodo */
	catContr: ICatContr;

	catComp: ICatComp;
	/** El array de trabajadores que son superiores de este trabajador, undefined o array vacío segun el endpoint al que se pidan datos */
	superiores?: ITrabajador[];
	/** El array de trabajadores que son pares de este trabajador, undefined o array vacío segun el endpoint al que se pidan datos */
	pares?: ITrabajador[];
	/** El array de trabajadores que son inferiores de este trabajador, undefined o array vacío segun el endpoint al que se pidan datos */
	inferiores?: ITrabajador[];

	createdAt: Date;

	endAt?: Date;
	/** Propiedad que indica si es el periodo actual o es uno pasado, cada trabajador solo tiene un periodo actual */
	actual: boolean;
}

/**
 * TODO: tsdoc in english, add example
 */
export interface IUser {
	username: string;

	password: string;

	email?: string;

	name?: string;

	lastname: string;

	createdAt: Date;

	updatedAt: Date;
	// TODO: Tsdoc.
	roles: IRole[];
	// TODO: Tsdoc.
	active: boolean;
	// TODO: Tsdoc.
	trabajador?: ITrabajador;
}

export interface IRole {
	id: number;
	name: string;
	description: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
}
