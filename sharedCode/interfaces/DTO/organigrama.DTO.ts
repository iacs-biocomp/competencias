import { ITrabajadorDTO, ITrabOrganiDTO } from './ITrabajador.DTO';

//TODO: TSdoc
export interface IOrganigramaEvDTO extends IOrganigramaUsrDTO {
	propuestos: undefined;
}

//TODO: TSdoc
export interface IOrganigramaUsrDTO {
	/** Representa el trabajador del cual se listan sus inferiores superiores y pares */
	trabajador: ITrabOrganiDTO;
	/** Son los inferiores del Trabajador de este mismo objeto*/
	inferiores: ITrabajadorDTO[];
	/** Son los superiores del Trabajador de este mismo objeto*/
	superiores: ITrabajadorDTO[];
	/** Son los pares del Trabajador de este mismo objeto*/
	pares: ITrabajadorDTO[];
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
