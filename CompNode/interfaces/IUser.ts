/**
 * Esquema del Json recibido al pedir los datos de un usuario al backend
 * @param Url /nest/users/{USERNAME}
 */
export interface IWorkerJson {
  codigo: number;
  nombre: string;
  apellidos: string;
  catComp: string;
  catContr: string;
  area: string;
  unidad: string;
  dni: string;
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
  status: string;
  roles: Role[];
}
export interface Role {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
