import { Interval } from 'date-fns';
import { IEvAllRequired } from './interfaces/DTO';
import { ICompetencia, IComportamiento, IEvModel, INivel, ISubModel } from './interfaces/Entity';
import { WithOptional } from './interfaces/Utility';

//TODO: Cambiar nombre
export type changeMyName = {
	/** Minima valoración que tiene una competencia, calculada por la función {@link maxYmin}*/
	minValoracion: number;
	/** Maxima valoración que tiene una competencia, calculada por la función {@link maxYmin}*/
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

/**
 * Busca un nivel en un array de niveles donde le indicamos el id del nivel
 *
 * @param niveles array de niveles
 * @param nivId id del nivel que queremos buscar
 * @returns si ha encontrado un nivel con ese id, retorna el nivel, si no undefined
 */
export function findNivelById(niveles: INivel[], nivCode: string): INivel | undefined {
	return niveles.find(nivel => nivel.code === nivCode);
}

/**
 * Busca una competencia en un array de competencias donde le indicamos el id de la competencia
 *
 * @param competencias array de competencias
 * @param compId id de la competencia que queremos buscar
 * @returns si ha encontrado una competencia con ese id la devuelve, si no undefined
 */
export function findCompById(competencias: ICompetencia[], compId: string): ICompetencia | undefined {
	return competencias.find(comp => comp.id === compId);
}

/**
 * TODO: Refactor
 * Calcula la maxima puntuación que un trabajador puede tener si todos los apartados que son positivos son evaluados al maximo y los negativos al minimo
 */
export function maxYmin(data: changeMyName) {
	const multiplicadores = data.niveles.map(nivel => nivel.valor);
	const multOrderded = [...multiplicadores.sort((a, b) => a - b)];
	return ((multOrderded: number[]) => {
		const aSumar = multOrderded.map(mult => {
			return mult > 0 ? mult * data.maxValoracion : mult * data.minValoracion;
		});
		const aRestar = multOrderded.map(mult => {
			return mult < 0 ? mult * data.maxValoracion : mult * data.minValoracion;
		});
		let suma = 0;
		let sumaMin = 0;
		aSumar.forEach(aSumar => {
			suma += aSumar;
		});
		aRestar.forEach(num => (sumaMin += num));
		return { max: suma, min: sumaMin };
	})(multOrderded);
}

/**
 * Concatena los arrays de comportamientos que puedan tener varios submodelos, con la MISMA competencia @see {@link ISubModel}
 * @param comp La competencia con la que se filtran los subModelos
 * @param subModels Array de subModelos del cual se devuelven sus comportamientos (concatenados donde comp==subModel.comp)
 * @returns El array de comportamientos que tiene esa competencia
 */
export function getAllComportsOfComp(comp: ICompetencia, subModels: ISubModel[]): IComportamiento[] {
	const subModelos = findSubModels(subModels, comp);
	let comports: IComportamiento[] = [];
	subModelos.forEach(s => (comports = comports.concat(s.comportamientos)));
	return comports;
}

/**
 * @param subModels El array de submodelos en el cual se buscaran el/los submodelo/s coincidente/s
 * @param comp La competencia que se usará como filtrado
 * @returns El array de subModelos que tienen esa competencia
 * TODO: usar T extends ISubModel
 */
export function findSubModels(
	subModels: ISubModel[],
	comp: Pick<ICompetencia, 'id'> | ICompetencia['id'],
): ISubModel[] {
	const compId = typeof comp === 'string' ? comp : comp.id;
	return subModels.filter(subModel => subModel.competencia.id === compId);
}

/**
 * Busca en el array de submodelos asociado con esa competencia
 * y ese nivel en concreto
 * @param subModels El array de submodelos en el que se busca el submodelo
 * @param comp La competencia usada para filtrar
 * @param niv El nivel que junto con la competencia hacen de filtro
 * @returns El submodelo que tiene ese nivel y competencia o undefined si no se encuentra ninguno
 */
export function findSubModelByCompNiv(
	subModels: ISubModel[],
	comp: ICompetencia,
	niv: INivel,
): ISubModel | undefined {
	return subModels.find(subModel => subModel.competencia === comp && subModel.nivel === niv);
}

/**
 * @param model El modelo del cual se sacan las competencias
 * @returns Un array que representa las competencias que tiene el modelo pasado como parametro
 */
export function getCompetOfModel(model: IEvModel): ICompetencia[] {
	if (!model.subModels) return [];
	const competencias = model.subModels.map(x => x.competencia);
	return competencias.filter((compet, index) => competencias.findIndex(f => compet.id === f.id) === index);
}

/**
 *  Comprueba si cierta competencia tiene comportamientos asociados a un nivel pasado como parametro
 * @param niv El codigo (no el id) del nivel u objeto a buscar
 * @param comp La competencia a comprobar
 * @param subModels Array de subModelos en los que se buscará uno con el niv y comp
 * @returns `true` si se ha encontrado un subModelo con ese nivel y esa competencia `false` en caso contrario
 */
export function checkNivOnComp(
	niv: INivel | INivel['code'],
	comp: ICompetencia | ICompetencia['id'],
	subModels: ISubModel[],
): boolean {
	const compIdStr = typeof comp === 'string' ? comp : comp.id;
	const nivIdStr = typeof niv === 'string' ? niv : niv.code;
	return !!subModels.find(s => s.competencia.id === compIdStr && s.nivel.code === nivIdStr) ? true : false;
}

/**
 *  TODO: Complete
 * @param objToggle objeto a eliminar o añadir
 * @param arrToPushRemove Donde se añade/elimina
 */
export function toggleInArray<T>(objToggle: T, arrToPushRemove: T[]) {
	const indx = arrToPushRemove.indexOf(objToggle);
	indx === -1 ? arrToPushRemove.push(objToggle) : arrToPushRemove.splice(indx, 1);
}

// TODO: Tsdoc
export function getIntervalsOfEv(
	ev: Omit<IEvAllRequired, 'id' | 'description' | 'model' | 'catComp'>,
): EvIntervals {
	//TODO: Solventar error, aunque la ev tenga las fechas como date al pasarlas de backend a front se serializan como string.
	//?? Tal vez una función que transforme las dates serializadas siempre que se piden evs?
	// parseISO('2021-01-05T23:00:00.000Z');
	const periodoEvaluar: Interval = { start: ev.iniValoracion, end: ev.endValoracion };
	const periodoPropuesta: Interval = { start: ev.iniDate, end: ev.finPropuestas };
	const periodoEvaluado: Interval = { start: ev.iniPerEvaluado, end: ev.endPerEvaluado };
	const periodoValidacion: Interval = { start: ev.iniValidacion, end: ev.endValidacion };

	return { periodoEvaluar, periodoPropuesta, periodoEvaluado, periodoValidacion };
}

// https://is.gd/Suahrg
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label
// https://rangle.io/blog/how-to-use-typescript-type-guards/
