import { ICatComp, ICatContr } from '../Entity/ICategorias';
import { ITrabajador } from '../Entity/IUser';

export type ITrabajadorDTO = Omit<ITrabajador, 'periodos' | 'user'> & {
	//TODO: Tsdoc
	catComp: ICatComp['id'];
	//TODO: Tsdoc
	catContr: ICatContr['id'];
	deleteable: boolean;
};

export interface ITrabOrgani extends Omit<ITrabajador, 'periodos' | 'user'> {
	/** La categoría competencial actual del trabajador, solo EL TRABAJADOR la tiene no sus sup/inf/pares */
	catComp?: ICatComp;
}
