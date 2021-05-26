import { ICompetencia, IComportamiento, INivel, ISubModel } from './interfaces/Entity';
import { WithOptional } from './interfaces/Utility';

export type changeMyName = {
	//TODO: Tsdoc (1)
	minValoracion: number;
	//TODO: Tsdoc (5)
	maxValoracion: number;
	niveles: WithOptional<INivel, 'subModels'>[];
};

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
 * Calcula la maxima puntuación que un trabajador puede tener si todos los apartados que son positivos son evaluados al maximo y los negativos al minimo
 */
export function maxYmin(data: changeMyName) {
	const multiplicadores = data.niveles.map(nivel => nivel.valor);
	const multOrderded = [...multiplicadores.sort((a, b) => a - b)];
	const maxPunt = ((multOrderded: number[]) => {
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
	return maxPunt;
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
 */
export function findSubModels(subModels: ISubModel[], comp: ICompetencia): ISubModel[] {
	return subModels.filter(subModel => subModel.competencia.id === comp.id);
}

// type SubModelFilterBy = {
// 	competencia?: ICompetencia | string;
// 	comportamientos?: IComportamiento[] | string[];
// 	niveles?: INivel[] | string[];
// };
// export function filterSubModels(subModels: ISubModel[], filter: SubModelFilterBy): ISubModel[] {
// 	subModels.filter(subModel => {
// 		let passTheFilter = true;
// 		compFilterLabel: {
// 			if (!filter.competencia) break compFilterLabel;
// 			if (typeof filter.competencia === 'string') {
// 				passTheFilter = subModel.competencia.id === filter.competencia;
// 			} else {
// 				passTheFilter = subModel.competencia.id === filter.competencia.id;
// 			}
// 		}
// 		comportFilterLabel: {
// 			if (!filter.comportamientos) break comportFilterLabel;
// 			if (typeof filter.comportamientos[0] === 'string') {
// 			}
// 		}
// 	});
// }
// https://is.gd/Suahrg
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label
// https://rangle.io/blog/how-to-use-typescript-type-guards/
