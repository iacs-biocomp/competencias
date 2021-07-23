import { ISubModel } from '.';

/**
 * Represents a level, have the same structure as backend entity.
 * Only should be used for create DTOs with same properties types.
 *
 * @author aml360 <aml360esp@gmail.com>
 */
export interface INivel {
	// TODO: Tsdoc
	id: number;
	// TODO: Tsdoc
	code: string;
	/** El valor del nivel como float */
	valor: number;
	// TODO: Tsdoc
	minRango: number;
	// TODO: Tsdoc
	maxRango: number;
	/** Los submodelos asociados a este nivel, en la mayoría de los casos esta propiedad será undefined */
	subModels?: ISubModel[];
}
