import { ITrabajador } from '../Entity/IUser';
import { Expand } from '../Utility';
import { ICCompDTO, ICContrGetDTO } from './categorias';

//TODO: Tsdoc
/**
 * @author aml360 <aml360esp@gmail.com>
 */
export type ITrabajadorDTO = Omit<ITrabajador, 'periodos' | 'user'>;

//TODO: Tsdoc
/**
 * @author aml360 <aml360esp@gmail.com>
 */
export type ITrabCCompCContrDTO = Expand<
	ITrabajadorDTO & {
		//TODO: Tsdoc
		catComp: ICCompDTO;
		//TODO: Tsdoc
		catContr: ICContrGetDTO;
	}
>;

export type ITrabAddDTO = Expand<ITrabCCompCContrStrDTO>;

export type ITrabCCompCContrStrDTO = Expand<
	Omit<ITrabCCompCContrDTO, 'catComp' | 'catContr'> & {
		catComp: string;
		catContr: string;
	}
>;

//TODO: Tsdoc
export type ITrabOrganiDTO = Expand<
	ITrabajadorDTO & {
		catComp: ICCompDTO;
	}
>;

export type IRelationsPostDTO = {
	dni: ITrabajador['dni'];
};
