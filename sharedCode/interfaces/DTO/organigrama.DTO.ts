import { ITrabajadorDTO, ITrabOrgani } from './ITrabajador.DTO';

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

/**
 *
 * @author aml360 <aml360esp@gmail.com>
 *
 */
export interface IOrganigramaTrabajadorDTO {
	//TODO: Tsdoc
	superiores: ITrabajadorDTO[];
	//TODO: Tsdoc
	pares: ITrabajadorDTO[];
	//TODO: Tsdoc
	inferiores: ITrabajadorDTO[];
}
