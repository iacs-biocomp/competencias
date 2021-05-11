import { IEvModel, ISubModel } from '../IEvaluaciones';

export type IModelDTO = Omit<RequiredAndNotNull<IEvModel>, 'id'>;

type RequiredAndNotNull<T> = {
  [P in keyof T]-?: Exclude<T[P], null | undefined>;
};
