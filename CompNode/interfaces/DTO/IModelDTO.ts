import { IEvModel, ISubModel } from "../IEvaluaciones";

export interface IModelDTO extends Omit<IEvModel, 'id' | 'subModels'>{
  subModels: ISubModel[];
}
