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
  // periodos: PeriodoTrab[];
}

export interface ICategoriesRelation {
  catContr: ICatContr;
  catComp: ICatComp;
}

//TODO: Añadir jsdoc
