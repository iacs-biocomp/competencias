import { IEvModel } from '../Entity/IEvaluaciones';
import { RequiredAndNotNull } from '../Utility';

export type IModelDTO = Omit<RequiredAndNotNull<IEvModel>, 'id'>;

//TODO: Tsdoc, ruta en /modelos/reference/${catComp} y /modelos/references siendo Array<IRefModel>
export type IRefModel = RequiredAndNotNull<IEvModel>;
