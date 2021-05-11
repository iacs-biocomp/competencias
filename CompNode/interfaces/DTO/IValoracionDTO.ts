// Estas interfaces pueden cambiar, si se modifican y
// el cambio produce incompatibilidad, se deja en desuso con @deprecated y se genera una nueva
// Cuando la vieja interfaz no se use, se eliminará y dará su nombre a la nueva.
export interface IValoracionDTO {
  /** Es el dni del que emite la valoracion */ //! Posible cambio a username en vez de evaluadorDni
  evaluadorDni: string;
  /** Es el dni del trabajador que es evaluado */
  evaluadoDni: string;
  /** Array de valoraciones, tiene una competencia y un array de comportamientos */
  valoraciones: [
    {
      compId: string;
      puntuaciones: [
        /** Es el identificador del comportamiento que se valora */
        comportId: string,
        /** Es la puntuacion que se le da al comportamiento de esa competencia */
        puntuacion: number //! Posible cambio de nombre
      ];
    }
  ];
  /** Debe coincidir con el id de la competencia a evaluar */
}
