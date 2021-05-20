import { ICompetencia, INivel } from './interfaces/Entity';

/**
 * Busca un nivel en un array de niveles donde le indicamos el id del nivel
 *
 * @param niveles array de niveles
 * @param nivId id del nivel que queremos buscar
 * @returns si ha encontrado un nivel con ese id, retorna el nivel, si no undefined
 */
export function findNivelById(niveles: INivel[], nivId: string): INivel | undefined {
	return niveles.find(nivel => nivel.id === nivId);
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
