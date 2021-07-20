import { RequiredAndNotNull } from '../Utility';
import { IEvaluacion, IEvModel } from '../Entity/IEvaluaciones';

/** Dto a usar cuando se quiere mandar al backend una petición para crear una nueva evaluación */
export type IEvSendDTO = Omit<IEvAllRequired, 'id'>;

//TODO: Tsdoc
export type IEvAllRequired = RequiredAndNotNull<IEvaluacion>;

/**
 * @version 0.0.1
 */
export type IEvModelDTO = RequiredAndNotNull<IEvModel>;
