import { ICompetencia, IComportamiento, IEvModel, INivel } from '../Entity/IEvaluaciones';
import { RequiredAndNotNull } from '../Utility';

export type IModelDTO = Omit<RequiredAndNotNull<IEvModel>, 'id' | 'evs'>;

//TODO: Tsdoc, ruta en /modelos/reference/${catComp} y /modelos/references siendo Array<IRefModel>
export type IRefModel = Omit<RequiredAndNotNull<IEvModel>, 'evs'>;

type ICompNoId = Omit<ICompetencia, 'id' | 'createdAt'>;
type IComportNoId = Omit<IComportamiento, 'id' | 'subModels'>;
type INivNoId = Omit<INivel, 'id' | 'subModels'>;

export type IModelBasicIndxDTO = Omit<RequiredAndNotNull<IEvModel>, 'subModels' | 'evs'> & {
	comps: {
		/** Es el identificador de la competencia que tiene ciertos comportamientos asociados*/
		[compId: string]: {
			/** Keys de la competencia */
			[P in keyof ICompNoId]: ICompNoId[P];
		} & {
			/** Lista de comportamientos que tiene esta competencia asociados */
			comports: {
				/** Id del comportamiento */
				[key: string]: {
					/** Keys del comportamiento */
					[P in keyof IComportNoId]: IComportNoId[P];
				};
			};
		};
	};
};

export type IFullModelIndxDTO = Omit<RequiredAndNotNull<IEvModel>, 'subModels' | 'evs'> & {
	comps: {
		/** Es el identificador de la competencia que tiene ciertos comportamientos asociados*/
		[compId: string]: {
			/** Keys de la competencia */
			[P in keyof ICompNoId]: ICompNoId[P];
		} & {
			niveles: {
				[P in keyof INivNoId]: INivNoId[P];
			} & {
				/** Lista de comportamientos que tiene esta competencia asociados */
				comports: {
					/** Id del comportamiento */
					[key: string]: {
						/** Keys del comportamiento */
						[P in keyof IComportNoId]: IComportNoId[P];
					};
				};
			};
		};
	};
};

export type IModelBasicDTO = Omit<RequiredAndNotNull<IEvModel>, 'subModels'> & {
	comps: {
		comp: ICompetencia;
		comports: IComportamiento[];
	}[];
};

/**
 * Type used for creating a new evModel, even if is a reference one or not
 * Used in enpoints: [/nest/modelos {POST}]
 */
export type INewEvModelDTO = RequiredAndNotNull<Omit<IEvModel, 'evs' | 'id'>>;

// const modelo2: IModelBasicDTO = {
//   id: '22',
//   catComp: { id: 'GR1', description: 'dsadsaasd' },
//   comps: [
//     {
//       comp: { id: 'C1', descripcion: 'desc de c1' },
//       comports: [{ id: 'Co1', descripcion: 'Desc del comportamiento1' }],
//     },
//   ],
// };

//Ejemplo de IModelSimpleDTO
// const modelo: IModelBasicIndxDTO = {
// 	/** Id del modelo */
// 	id: '21',
// 	catComp: { id: 'GR1', description: 'Gr1 descripción' },
// 	comps: {
// 		C1: {
// 			descripcion: 'desc de la c1',
// 			comports: {
// 				Co1: {
// 					descripcion: 'dsadsaasd',
// 				},
// 				Co2: {
// 					descripcion: 'dsadsaasd',
// 				},
// 				Co3: {
// 					descripcion: 'dsadsaasd',
// 				},
// 				Co4: {
// 					descripcion: 'dsadsaasd',
// 				},
// 			},
// 		},
// 		C2: {
// 			descripcion: 'desc de la c2',
// 			comports: {
// 				Co3: {
// 					descripcion: 'dsadsaasd',
// 				},
// 				Co4: {
// 					descripcion: 'dsadsaasd',
// 				},
// 			},
// 		},
// 	},
// };

// console.log(modelo.id);
// console.log(modelo.comps['C1']);
// //Iterando sobre las competencias del modelo, imprime todas como objeto
// const comps = modelo.comps;
// console.log(Object.keys(comps).map(key => comps[key]));
// //Imprimir un comportamiento sabiendo la competencia y el id del comportamiento
// console.log(comps.C1.comports.Co1);
// //Lo mismo pero parametrizable, se pueden obtener esos strings del object.keys (Se deberian guardar en un array de ayuda???)
// console.log(comps['C1'].comports['Co1']);

// const comports = Object.keys(comps['C1'].comports).map(key => {
// 	return {
// 		descripcion: comps.C1.comports[key].descripcion,
// 		id: key,
// 	};
// }) as IComportamiento[];
// console.log(comports);
