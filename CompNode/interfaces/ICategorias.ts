export interface ICatComp {
  id: string;
  description: string;
  // periodosTrab: PeriodoTrab[];
  // models: EvModel[];
  // evaluaciones: Ev[];
}
export interface ICatContr {
  id: string;
  description: string;
  /**Es la categoria competencial "Por defecto". Es decir a que categoría competencial corresponde esta contractual en ESTE MOMENTO*/
  catComp: ICatComp;
}

//TODO: Añadir jsdoc
