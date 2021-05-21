import { WithOptional } from 'sharedInterfaces/Utility';
import { ICompetencia, INivel } from './interfaces/Entity';

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

export type changeMyName = {
	//TODO: Tsdoc (1)
	minValoracion: number;
	//TODO: Tsdoc (5)
	maxValoracion: number;
	niveles: WithOptional<INivel, 'subModels'>[];
};

// console.log(
// 	maxYmin({
// 		maxValoracion: 5,
// 		minValoracion: 1,
// 		niveles: [
// 			{ id: 1, minRang code: 'N2', valor: 2 },
// 			{ code: 'N4', valor: 4 },
// 			{ code: 'N1', valor: -0.25 },
// 			{ code: 'N-1', valor: -1 },
// 			{ code: 'N3', valor: 3 },
// 		],
// 	}),
// );
