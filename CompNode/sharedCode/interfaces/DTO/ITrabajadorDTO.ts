import { ICatComp } from '../Entity/ICategorias';
import { ITrabajador } from '../Entity/IUser';

export interface ITrabajadorDTO {
	dni: string;

	nombre: string;

	apellidos: string;

	area: string;

	unidad: string;

	departamento: string;

	catComp: string;

	catContr: string;

	deleteable: boolean;
}

export interface ITrabOrgani extends Omit<ITrabajador, 'periodos' | 'user'> {
	/** La categoría competencial actual del trabajador, solo EL TRABAJADOR la tiene no sus sup/inf/pares */
	catComp?: ICatComp;
}
export interface IOrganigramaUsrDTO {
	/** Representa el trabajador del cual se listan sus inferiores superiores y pares */
	trabajador: ITrabOrgani;
	/** Son los inferiores del Trabajador de este mismo objeto*/
	inferiores: ITrabOrgani[];
	/** Son los superiores del Trabajador de este mismo objeto*/
	superiores: ITrabOrgani[];
	/** Son los pares del Trabajador de este mismo objeto*/
	pares: ITrabOrgani[];
}
