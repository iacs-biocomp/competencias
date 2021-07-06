/** Tipo que excluye null y undefined de las keys de un objeto y las pone en requeridas (quita el ?) */
export type RequiredAndNotNull<T> = {
	[P in keyof T]-?: Exclude<T[P], null | undefined>;
};

/** Type que permite cambiar las keys K a parciales de un objeto tipo T */
export type WithOptional<T, K extends keyof T> = Partial<T> & Omit<T, K>;
