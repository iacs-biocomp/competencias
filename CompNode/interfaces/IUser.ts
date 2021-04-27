import { ICatComp, ICatContr } from './ICategorias';

/**
 * Esquema del Json recibido al pedir los datos de un usuario al backend
 * @param Url /nest/users/{USERNAME}
 */
export interface ITrabajador {
  dni: string;

  nombre: string;

  apellidos: string;

  area: string;

  unidad: string;

  departamento: string;

  periodos: IPeriodoTrab[] | undefined;

  catComp?: ICatComp;

  user: IUserJson;
}
export interface IPeriodoTrab {
  id: number;

  trabajador: ITrabajador;

  catContr: ICatContr;

  catComp: ICatComp;
  /** El array de trabajadores que son superiores de este trabajador, undefined o array vacío segun el endpoint al que se pidan datos */
  superiores: ITrabajador[] | undefined;
  /** El array de trabajadores que son pares de este trabajador, undefined o array vacío segun el endpoint al que se pidan datos */
  pares: ITrabajador[];
  /** El array de trabajadores que son inferiores de este trabajador, undefined o array vacío segun el endpoint al que se pidan datos */
  inferiores: ITrabajador[];

  createdAt: Date;

  endAt: Date | undefined;

  actual: boolean;
}

/**
 * Esquema del Json recibido al pedir los datos de un usuario al backend
 * @param Url /nest/users/{USERNAME}
 */
export interface IUserJson {
  username: string;

  password: string;

  email: string;

  name: string;

  lastname: string;

  createdAt: Date;

  updatedAt: Date;

  roles: Role[];

  active: boolean;

  trabajador: ITrabajador | undefined;
}
export interface Role {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
