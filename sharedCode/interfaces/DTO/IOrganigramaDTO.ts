import { ITrabOrgani } from './ITrabajadorDTO';

//TODO: TSdoc
export interface IOrganigramaEvDTO extends IOrganigramaUsrDTO {
	propuestos: undefined;
}

//TODO: TSdoc
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
