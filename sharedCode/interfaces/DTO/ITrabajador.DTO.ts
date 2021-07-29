import { ICatComp, ICatContr } from '../Entity/ICategorias';
import { ITrabajador } from '../Entity/IUser';
import { ICCompDTO } from './categorias';

//TODO: Tsdoc
/**
 * @author aml360 <aml360esp@gmail.com>
 */
export type ITrabajadorDTO = Omit<ITrabajador, 'periodos' | 'user'>;

//TODO: Tsdoc
/**
 * @author aml360 <aml360esp@gmail.com>
 */
export type ITrabCCompCContrDTO = ITrabajadorDTO & {
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

//TODO: Tsdoc
export type ITrabOrganiDTO = ITrabajadorDTO & {
	catComp: ICCompDTO;
};

export type IRelationsPostDTO = {
	dni: ITrabajador['dni'];
};
