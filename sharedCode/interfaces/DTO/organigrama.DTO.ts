import { ITrabajadorDTO, ITrabOrgani, ITrabOrganiDTO } from './ITrabajador.DTO';

//TODO: TSdoc
export interface IOrganigramaEvDTO extends IOrganigramaUsrDTO {
	propuestos: undefined;
}

//TODO: TSdoc
export interface IOrganigramaUsrDTO {
	/** Representa el trabajador del cual se listan sus inferiores superiores y pares */
	trabajador: ITrabOrganiDTO;
	/** Son los inferiores del Trabajador de este mismo objeto*/
	inferiores: ITrabOrganiDTO[];
	/** Son los superiores del Trabajador de este mismo objeto*/
	superiores: ITrabOrganiDTO[];
	/** Son los pares del Trabajador de este mismo objeto*/
	pares: ITrabOrganiDTO[];
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
