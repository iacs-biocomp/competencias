import { IEvaluacion } from '../Entity/IEvaluaciones';

/** Dto a usar cuando se quiere mandar al backend una petición para crear una nueva evaluación */
export interface IEvSendDTO extends Required<Omit<IEvaluacion, 'id'>> {}
