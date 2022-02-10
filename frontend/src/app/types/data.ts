import { ICatComp, ICompetencia, IComportamiento, INivel } from 'sharedInterfaces/Entity';

/**
 * Type destined for create a object that stores common data used of the database
 * @deprecated Create types in every component instead.
 */
export type DbData = {
	/** Array of ICatComp */
	cComps: ICatComp[];
	/** Array of ICompetencia */
	comps: ICompetencia[];
	/** Array of IComportamiento */
	comports: IComportamiento[];
	/** Array of INivel */
	niveles: INivel[];
};
