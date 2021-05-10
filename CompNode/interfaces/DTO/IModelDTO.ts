import { IEvModel, ISubModel } from '../IEvaluaciones';

export interface IModelDTO extends Omit<IEvModel, 'id' | 'subModels'> {
  // TODO: Hacer que la catComp no sea undefined en el dto y usar El type q ofrece typescript Partial https://is.gd/wSCj6H
  subModels: ISubModel[];
}
