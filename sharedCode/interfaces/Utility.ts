/** Tipo que excluye null y undefined de las keys de un objeto y las pone en requeridas (quita el ?) */
export type RequiredAndNotNull<T> = {
	[P in keyof T]-?: Exclude<T[P], null | undefined>;
};

/** Type que permite cambiar las keys K a parciales de un objeto tipo T */
export type WithOptional<T, K extends keyof T> = Partial<T> & Omit<T, K>;

/** Primitive types of typescript including Function */
export type TsPrimitiveTypes = number | Function | string | boolean | Date;

/**
 * Type that remove all properties of Object<T> which extends type U
 *
 * @example
 * ```ts
 * type UserEntity = {
 * 	username: string;
 * 	password: string;
 * 	details: UserDetails;
 * 	roles: Role[]
 * }
 * /// Supose that we need to remove all Primitive types from UserEntity
 * type TsPrimitiveTypes =  number | Function | string | boolean | Date;
 * type UserNoPrimitives = RemovePropsInU<UserEntity, string>;
 * /// UserNoPrimitives
 *
 * ```
 * @author aml360 <aml360esp@gmail.com>
 * @see https://is.gd/MM3L37
 */
export type RemovePropsInU<T, U> = {
	[P in keyof T as T[P] extends U ? never : P]: T[P];
};

/**
 * Type that remove all properties of Object<T> which extends type U
 *
 * @example
 * ```ts
 * type UserEntity = {
 * 	username: string;
 * 	password: string;
 * 	details: UserDetails;
 * 	roles: Role[]
 * }
 * /// Supose that we need to remove all Primitive types from UserEntity
 * type TsPrimitiveTypes =  number | Function | string | boolean | Date;
 * type UserNoPrimitives = RemovePropsInU<UserEntity, string>;
 * /// UserNoPrimitives
 *
 * ```
 * @author aml360 <aml360esp@gmail.com>
 * @see https://is.gd/MM3L37
 */
export type PickPropsInU<T, U> = {
	[P in keyof T as T[P] extends U ? P : never]: T[P];
};

/**
 * Type that validates in compilation time that type T does not contain more properties than type Shape
 * @see {@link TODO: Link de donde lo saque}
 */
type ValidateShape<T, Shape> = T extends Shape
	? Exclude<keyof T, keyof Shape> extends never
		? T
		: never
	: never;

/**
 * TODO: Tsdoc de que hace
 * @see https://is.gd/EPR552
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

/**
 * TODO: Tsdoc de que hace
 * @see https://is.gd/EPR552
 */
export type ExpandRecursively<T> = T extends object
	? T extends infer O
		? { [K in keyof O]: ExpandRecursively<O[K]> }
		: never
	: T;
