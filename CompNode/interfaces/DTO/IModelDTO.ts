import { IEvModel } from '../Entity/IEvaluaciones';
import { RequiredAndNotNull } from '../Utility';

export type IModelDTO = Omit<RequiredAndNotNull<IEvModel>, 'id'>;
