import { Interval } from 'date-fns';
import { IEvaluacion } from './interfaces/Entity';
import { ICompetencia } from './interfaces/Entity/ICompetencia';
import { IComportamiento } from './interfaces/Entity/IComportamientos';
import { INivel } from './interfaces/Entity/INiveles';
import { Expand, PickPropsInU, RequiredAndNotNull, WithOptional } from './interfaces/Utility';
import { find } from 'lodash';

type Without<T, K extends keyof T> = {
	[P in Exclude<keyof T, K>]: T[P];
};

/**
 *
 * @param obj The object that will be truncated
 * @param keys Array of keys which will be removed of obj.
 * @returns The object without keys in `keys` array param
 *
 * @example
 *
 * ```ts
 *
 * type TestType = {
 * 	prop1: number;
 * 	prop2: number;
 * };
 *
 * const toTransform: TestType = { prop1: 1, prop2: 2 };
 * const transformed = deleteProps(toTransform, ['prop1']);
 * ```
 * @author aml360 <aml360esp@gmail.com>
 *
 */
export function deleteProps<T, K extends keyof T, U extends Expand<Without<T, K>>>(obj: T, keys: K[]): U {
	keys.forEach(key => delete obj[key]);
	return obj as unknown as U;
}

export type EvScoringParamData = {
	/** Minima valoración que tiene una competencia, calculada por la función {@link computeEvScoringLimits}*/
	minValoracion: number;
	/** Maxima valoración que tiene una competencia, calculada por la función {@link computeEvScoringLimits}*/
	maxValoracion: number;
	/** Los niveles que tiene cierta evaluación (NUNCA los de referencia)*/
	niveles: WithOptional<INivel, 'subModels'>[];
};

export type EvIntervals = {
	periodoEvaluar: Interval;
	periodoPropuesta: Interval;
	periodoEvaluado: Interval;
	periodoValidacion: Interval;
};

export const getKeyValue =
	<T extends object, U extends keyof T>(key: U) =>
	(obj: T) =>
		obj[key];

type MinNivel = {
	code: INivel['code'];
};
/**
 * Busca un nivel en un array de niveles donde le indicamos el id del nivel
 *
 * @param niveles array de niveles
 * @param nivId id del nivel que queremos buscar
 * @returns si ha encontrado un nivel con ese id, retorna el nivel, si no undefined
 */
export function findNivelById<T extends MinNivel>(niveles: T[], nivCode: string): T | undefined {
	return niveles.find(nivel => nivel.code === nivCode);
}

/**
 * Busca una competencia en un array de competencias donde le indicamos el id de la competencia
 *
 * @param competencias array de competencias
 * @param compId id de la competencia que queremos buscar
 * @returns si ha encontrado una competencia con ese id la devuelve, si no undefined
 */
export function findCompById<T extends MinCompetencia>(competencias: T[], compId: string): T | undefined {
	return competencias.find(comp => comp.id === compId);
}

/**
 * Calcula la maxima puntuación que un trabajador puede tener si todos los apartados que son positivos son evaluados al maximo y los negativos al minimo
 */
export function computeEvScoringLimits(data: EvScoringParamData): { max: number; min: number } {
	const multiplicadores = data.niveles.map(nivel => nivel.valor);
	const multOrderded = [...multiplicadores].sort((a, b) => a - b);
	return ((mults: number[]) => {
		const aSumar = mults.map(mult => {
			return mult > 0 ? mult * data.maxValoracion : mult * data.minValoracion;
		});
		const aRestar = mults.map(mult => {
			return mult < 0 ? mult * data.maxValoracion : mult * data.minValoracion;
		});
		let suma = 0;
		let sumaMin = 0;
		aSumar.forEach(toSum => {
			suma += toSum;
		});
		aRestar.forEach(num => (sumaMin += num));
		return { max: suma, min: sumaMin };
	})(multOrderded);
}

type MinComport = {
	id: IComportamiento['id'];
};

type MinSubModel2<T extends MinComport> = MinSubModel & {
	comportamientos: T[];
};

/**
 * Concatena los arrays de comportamientos que puedan tener varios submodelos, con la MISMA competencia @see {@link ISubModel}
 * @param comp La competencia con la que se filtran los subModelos
 * @param subModels Array de subModelos del cual se devuelven sus comportamientos (concatenados donde comp==subModel.comp)
 * @returns El array de comportamientos que tiene esa competencia
 */
export function getAllComportsOfComp<U extends MinComport, T extends MinSubModel2<U>>(
	comp: ICompetencia['id'] | Pick<ICompetencia, 'id'>,
	subModels: T[],
): U[] {
	const subModelos = findSubModels(subModels, comp);
	let comports: U[] = [];
	subModelos.forEach(s => (comports = comports.concat(s.comportamientos)));
	return comports;
}

type MinSubModel = {
	competencia: MinCompetencia;
};

/**
 * @param subModels El array de submodelos en el cual se buscaran el/los submodelo/s coincidente/s
 * @param comp La competencia que se usará como filtrado
 * @returns El array de subModelos que tienen esa competencia
 */
export function findSubModels<T extends MinSubModel>(
	subModels: T[],
	comp: Pick<ICompetencia, 'id'> | ICompetencia['id'],
): T[] {
	const compId = typeof comp === 'string' ? comp : comp.id;
	return subModels.filter(subModel => subModel.competencia.id === compId);
}

/**
 * @param subModels El array de submodelos en el que se busca el submodelo
 * @param comp La competencia usada para filtrar
 * @param niv El nivel que junto con la competencia hacen de filtro
 * @returns El submodelo que tiene ese nivel y competencia o undefined si no se encuentra ninguno
 */
export function findSubModel<T extends MinSubModel3>(
	subModels: T[],
	comp: MinCompetencia,
	niv: MinNivel,
): T | undefined {
	return subModels.find(subModel => subModel.competencia.id === comp.id && subModel.nivel.code === niv.code);
}

/**
 * @param comp la competencia elegida para obtener los comportamientos
 * @param subModels submodelos para buscar la competencia
 * @returns los comportamientos por competencia filtrados
 */
export function filterNonSelectedComports<T extends MinComport>(
	comports: T[],
	comp: MinCompetencia,
	subModels: MinSubModel2<MinComport>[],
): T[] {
	const comportsOfComp = getAllComportsOfComp(comp, subModels);
	/** Numero de comportamientos ya excluidos, si es igual a comportsOfComp.lenght-1 romper el filtro (innecesaio) */
	const nExcluded = 0;
	return comports.filter(dbComport => {
		if (nExcluded !== comportsOfComp.length - 1) {
			return !comportsOfComp.find(c4filter => c4filter.id === dbComport.id);
		} else {
			return true;
		}
	});
}

type MinSubModel3 = {
	competencia: MinCompetencia;
	nivel: MinNivel;
};

/**
 * Busca en el array de submodelos asociado con esa competencia
 * y ese nivel en concreto
 * @param subModels El array de submodelos en el que se busca el submodelo
 * @param comp La competencia usada para filtrar
 * @param niv El nivel que junto con la competencia hacen de filtro
 * @returns El submodelo que tiene ese nivel y competencia o undefined si no se encuentra ninguno
 */
export function findSubModelByCompNiv<T extends MinSubModel3>(
	subModels: T[],
	comp: MinCompetencia,
	niv: MinNivel,
): T | undefined {
	return subModels.find(subModel => subModel.competencia.id === comp.id && subModel.nivel.code === niv.code);
}

type MinCompetencia = {
	id: ICompetencia['id'];
};

type MinEvModel<T extends MinCompetencia> = {
	subModels: {
		competencia: T;
	}[];
};

type MinEvModelFull<T extends MinCompetencia, U extends MinNivel, P extends MinComport> = {
	subModels: {
		competencia: T;
		nivel: U;
		comportamientos: P[];
	}[];
};

/**
 * @param model El modelo del cual se sacan las competencias
 * @returns Un array que representa las competencias que tiene el modelo pasado como parametro
 */
export function getCompetOfModel<U extends MinCompetencia>(model: MinEvModel<U>): U[] {
	if (model.subModels.length === 0) return [];
	return model.subModels.reduce<U[]>((acc, subModel) => {
		if (!find(acc, { id: subModel.competencia.id })) {
			acc.push(subModel.competencia);
		}
		return acc;
	}, []);
}

/**
 *
 * @param model Model with subModels that have competences, levels and behaviours.
 * @returns Object with all competences, levels and behaviours that `model` have (**no repeated**)
 */
export function getAllOfModel<T extends MinCompetencia, U extends MinNivel, P extends MinComport>(
	model: MinEvModelFull<T, U, P>,
): {
	comps: T[];
	nivs: U[];
	comports: P[];
} {
	if (model.subModels.length === 0) {
		return { comps: [], nivs: [], comports: [] };
	} else {
		const comps = model.subModels.reduce<T[]>((acc, subModel) => {
			const compFinded = acc.find(comp => comp.id === subModel.competencia.id);
			if (!compFinded) {
				acc.push(subModel.competencia);
			}
			return acc;
		}, []);
		const nivs = model.subModels.reduce<U[]>((acc, subModel) => {
			const nivFinded = acc.find(lvl => lvl.code === subModel.nivel.code);
			if (!nivFinded) {
				acc.push(subModel.nivel);
			}
			return acc;
		}, []);
		let allComports: P[] = [];
		model.subModels.forEach(subModel => {
			allComports = allComports.concat(subModel.comportamientos);
		});
		const comports = allComports.reduce<P[]>((acc, comport) => {
			if (!acc.find(c => c.id === comport.id)) {
				acc.push(comport);
			}
			return acc;
		}, []);

		return { comps, nivs, comports };
	}
}

export function lowerCaseNoWhiteSpaces(value: string): string {
	return value.toLowerCase().replace(/\s/g, '');
}

/**
 *  Comprueba si cierta competencia tiene comportamientos asociados a un nivel pasado como parametro
 * @param niv El codigo (no el id) del nivel u objeto a buscar
 * @param comp La competencia a comprobar
 * @param subModels Array de subModelos en los que se buscará uno con el niv y comp
 * @returns `true` si se ha encontrado un subModelo con ese nivel y esa competencia `false` en caso contrario
 */
export function checkNivOnComp(
	niv: MinNivel | INivel['code'],
	comp: MinCompetencia | ICompetencia['id'],
	subModels: MinSubModel3[],
): boolean {
	const compIdStr = typeof comp === 'string' ? comp : comp.id;
	const nivIdStr = typeof niv === 'string' ? niv : niv.code;
	return !!subModels.find(s => s.competencia.id === compIdStr && s.nivel.code === nivIdStr);
}

/**
 * Adds an object T to an array if this object doesn't exist, removes it otherwise
 *
 * @param objToggle objeto a eliminar o añadir
 * @param arrToPushRemove Donde se añade/elimina
 */
export function toggleInArray<T>(objToggle: T, arrToPushRemove: T[]) {
	const indx = arrToPushRemove.indexOf(objToggle);
	indx === -1 ? arrToPushRemove.push(objToggle) : arrToPushRemove.splice(indx, 1);
}

// TODO: Tsdoc
export function getIntervalsOfEv(ev: PickPropsInU<RequiredAndNotNull<IEvaluacion>, Date>): EvIntervals {
	const periodoEvaluar: Interval = { start: ev.iniValoracion, end: ev.endValoracion };
	const periodoPropuesta: Interval = { start: ev.iniDate, end: ev.finPropuestas };
	const periodoEvaluado: Interval = { start: ev.iniPerEvaluado, end: ev.endPerEvaluado };
	const periodoValidacion: Interval = { start: ev.iniValidacion, end: ev.endValidacion };
	return { periodoEvaluar, periodoPropuesta, periodoEvaluado, periodoValidacion };
}

// https://is.gd/Suahrg
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label
// https://rangle.io/blog/how-to-use-typescript-type-guards/
