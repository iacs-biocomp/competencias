import { ICompGetDTO, IComportGetDTO, INivelGetDTO } from '.';
import { ISubModel } from '../Entity';

export type ISubModelGetDTO = {
	id: number;
	nivel: INivelGetDTO;
	// TODO: Tsdoc
	competencia: ICompGetDTO;
	// TODO: Tsdoc
	comportamientos: IComportGetDTO[];
	nivelDescription?: ISubModel['nivelDescription'];
};

/**
 * TODO: TSdoc
 * ```ts
 * type expanded here
 * ```
 *
 *
 */
export type ISubModelAddDTO = Omit<ISubModelGetDTO, 'id'>;
