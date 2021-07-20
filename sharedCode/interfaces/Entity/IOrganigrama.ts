import { ITrabajadorDTO } from '../DTO';
import { ITrabajador } from './IUser';

/**
 * Interfaz que representa el organigrama de un trabajador;
 * mostrando un resumen de su informacion personal, así como sus
 * superiores, inferiores y pares
 *
 * @param Url
 */
export interface IOrganigramaTrabajador {
	//TODO: Tsdoc
	superiores: ITrabajador[];
	//TODO: Tsdoc
	pares: ITrabajador[];
	//TODO: Tsdoc
	inferiores: ITrabajador[];
}

export interface IOrganigramaTrabajadorDTO {
	//TODO: Tsdoc
	superiores: ITrabajadorDTO[];
	//TODO: Tsdoc
	pares: ITrabajadorDTO[];
	//TODO: Tsdoc
	inferiores: ITrabajadorDTO[];
}
