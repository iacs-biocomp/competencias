/** Tipo que excluye null y undefined de las keys de un objeto y las pone en requeridas (quita el ?) */
export type RequiredAndNotNull<T> = {
  [P in keyof T]-?: Exclude<T[P], null | undefined>;
};

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
