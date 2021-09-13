import { ICCompDTO, ICompNoId, IComportNoId, INivNoId } from '.';
import { IEvModel, ICompetencia, IComportamiento } from '../Entity';
import { Expand, PickPropsInU, RequiredAndNotNull, TsPrimitiveTypes } from '../Utility';
import { ISubModelAddDTO, ISubModelGetDTO } from './submodelos.DTO';

// TODO: completar
export type IEvModelDTO = IEvModel;

export type IEvModelAddDTO = Expand<
	Omit<IEvModelGetDTO, 'id' | 'subModels'> & {
		subModels: ISubModelAddDTO[];
	}
>;

// TODO: completar
export type IEvModelRefUpdateDTO = Expand<
	Pick<IEvModel, 'id'> & {
		catComp: ICCompDTO;
		subModels: ISubModelGetDTO[];
	}
>;

/**
 * @version 0.0.1
 */
export type IEvModelGetDTO = Expand<
	PickPropsInU<RequiredAndNotNull<IEvModel>, TsPrimitiveTypes> & {
		catComp: ICCompDTO;
		// evs: IEvaluacion[];
		subModels: ISubModelGetDTO[];
	}
>;

/** @deprecated change to DTO */
export type IModelDTO = Omit<RequiredAndNotNull<IEvModel>, 'id' | 'evs'>;

/** @deprecated change to DTO */
export type IRefModel = Omit<RequiredAndNotNull<IEvModel>, 'evs'>;

/** @deprecated change to DTO */
export type IModelBasicIndxDTO = Omit<RequiredAndNotNull<IEvModel>, 'subModels' | 'evs'> & {
	comps: {
		/** Es el identificador de la competencia que tiene ciertos comportamientos asociados*/
		[compId: string]: {
			/** Keys de la competencia */
			[P in keyof ICompNoId]: ICompNoId[P];
		} & {
			/** Lista de comportamientos que tiene esta competencia asociados */
			comports: {
				/** Id del comportamiento */
				[key: string]: {
					/** Keys del comportamiento */
					[P in keyof IComportNoId]: IComportNoId[P];
				};
			};
		};
	};
};

export type IFullModelIndxDTO = Omit<RequiredAndNotNull<IEvModel>, 'subModels' | 'evs'> & {
	comps: {
		/** Es el identificador de la competencia que tiene ciertos comportamientos asociados*/
		[compId: string]: {
			/** Keys de la competencia */
			[P in keyof ICompNoId]: ICompNoId[P];
		} & {
			niveles: {
				[P in keyof INivNoId]: INivNoId[P];
			} & {
				/** Lista de comportamientos que tiene esta competencia asociados */
				comports: {
					/** Id del comportamiento */
					[key: string]: {
						/** Keys del comportamiento */
						[P in keyof IComportNoId]: IComportNoId[P];
					};
				};
			};
		};
	};
};

/** @deprecated Not used, refactor to new type if used in any front component */
export type IModelBasicDTO = Omit<RequiredAndNotNull<IEvModel>, 'subModels'> & {
	comps: {
		comp: ICompetencia;
		comports: IComportamiento[];
	}[];
};
