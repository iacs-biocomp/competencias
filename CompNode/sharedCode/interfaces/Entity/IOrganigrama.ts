import { ITrabajador } from './IUser';

/**
 * Interfaz que representa el organigrama de un trabajador;
 * mostrando un resumen de su informacion personal, así como sus
 * superiores, inferiores y pares
 *
 * @param Url
 */
export interface IOrganigramaTrabajador {
	superiores: ITrabajador[];

	pares: ITrabajador[];

	inferiores: ITrabajador[];
}
