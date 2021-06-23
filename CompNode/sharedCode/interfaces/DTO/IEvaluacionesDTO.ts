import { RequiredAndNotNull } from '../Utility';
import { IEvaluacion } from '../Entity/IEvaluaciones';

/** Dto a usar cuando se quiere mandar al backend una petición para crear una nueva evaluación */
export type IEvSendDTO = Omit<IEvAllRequired, 'id'>;

//TODO: Tsdoc
export type IEvAllRequired = RequiredAndNotNull<IEvaluacion>;
