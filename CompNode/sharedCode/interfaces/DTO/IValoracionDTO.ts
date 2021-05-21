// Estas interfaces pueden cambiar, si se modifican y
// el cambio produce incompatibilidad, se deja en desuso con @deprecated y se genera una nueva
// Cuando la vieja interfaz no se use, se eliminará y dará su nombre a la nueva.
export interface IValoracionDTO {
	/** Es el dni del que emite la valoracion */ //! Posible cambio a username en vez de evaluadorDni
	evaluadorDni: string;
	/** Es el dni del trabajador que es evaluado */
	evaluadoDni: string;
	/** Array de valoraciones, tiene una competencia y un array de comportamientos */
	valoraciones: Array<{
		compId: string;
		puntuaciones: Array<{
			/** Es el identificador del comportamiento que se valora */
			comportId: string;
			/** Es la puntuacion que se le da al comportamiento de esa competencia */
			puntuacion: number; //! Posible cambio de nombre
		}>;
	}>;
}

/**
 * Interfaz de las valoraciones con indices, mas simple para mostrar datos, comprobar posibles undefined al dar keys que no esten en el objeto.
 */
export interface IValoracionIndexadaDTO {
	/** Es el dni del que emite la valoracion */ //! Posible cambio a username en vez de evaluadorDni
	evaluadorDni: string;
	/** Es el dni del trabajador que es evaluado */
	evaluadoDni: string;
	/** Array de valoraciones, tiene una competencia y un array de comportamientos */
	valoraciones: {
		[compId: string]: {
			/** Es el identificador del comportamiento que se valora */
			[comportId: string]: number;
		};
	};
}

const exampleValoracionDto: IValoracionDTO = {
	evaluadorDni: '321231231D',
	evaluadoDni: '712894789D',
	valoraciones: [
		{
			compId: 'C1',
			puntuaciones: [
				{
					comportId: 'Co1',
					puntuacion: 5,
				},
				{
					comportId: 'Co1',
					puntuacion: 5,
				},
			],
		},
		{
			compId: 'C2',
			puntuaciones: [
				{
					comportId: 'Co1',
					puntuacion: 5,
				},
			],
		},
	],
};

const exampleValoracionIndxDto: IValoracionIndexadaDTO = {
	evaluadorDni: '321231231D',
	evaluadoDni: '712894789D',
	valoraciones: {
		C1: {
			Co1: 5,
			Co2: 3,
			Co3: 1,
			Co5: 4,
		},
		C2: {
			Co1: 2,
			Co2: 1,
		},
	},
};

// Teniendo typescript instalado globalmente (sudo npm i -g typescript)
// Para ejecutar el codigo en terminal hacer : tsc IValoracionDTO.ts && node IValoracionDTO.js && rm IValoracionDTO.js

// const valoracion = exampleValoracionIndxDto.valoraciones['C1'];
// const valores = Object.keys(valoracion).map((key) => valoracion[key]);
// console.log(valores);

// const valoracionUndefined = exampleValoracionIndxDto.valoraciones['dsa'];
// console.log(`Valoración undefined por introducir mal la key del objeto: ${valoracionUndefined}`);

// const json = JSON.stringify(exampleValoracionIndxDto);
// console.log(`JsonStringify de exampleVal: ${json}`);
