import { ICatComp } from './ICategorias';

/**
 * Interfaz que representa la información basica de una evaluación.
 *
 * Endpoints disponibles: /nest/evaluaciones/$USER (Username como parametro)
 */
export interface IEvaluacion {
  /** El id como integer de la evaluación */
  id: number;
  /** La descripción de la evaluación */
  description: string;
  /** El modelo que usa la evaluación (Donde se indican competencias comportamientos y niveles) */
  model: IEvModel;
  /** La categoría competencial de la evaluación */
  catComp: ICatComp;
}

export interface IEvModel {
  id: string;
  // TODO: Comprobar si el modelo tambien tiene las evaluaciones,
  // la interfaz cambiará lo mas probable
  //!No usar hasta completarla

  // evs: Ev[];
  catComp: ICatComp;
  // subModels: SubModel[];
}
