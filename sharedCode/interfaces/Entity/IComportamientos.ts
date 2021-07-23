import { ISubModel } from '.';

/**
 *  Representa un comportamiento, tiene la misma estructura que la entidad en el backend
 * y solo se debería usar para crear nuevos tipos como los DTO
 *
 * @author aml360 <aml360esp@gmail.com>
 */
export interface IComportamiento {
	// TODO: Tsdoc con ejemplos de posibles id de comports
	id: string;
	// TODO: Tsdoc
	descripcion: string;
	/** Los submodelos asociados a este comportamiento, en la mayoría de los casos esta propiedad será undefined */
	subModels?: ISubModel[];
}
