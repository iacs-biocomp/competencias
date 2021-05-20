import { ICompetencia, INivel } from './interfaces/Entity';

// TODO: Tsdoc
export function findNivelById(niveles: INivel[], nivId: string): INivel | undefined {
	return niveles.find(nivel => nivel.id === nivId);
}
// TODO: Tsdoc
/** */
export function findCompById(competencias: ICompetencia[], compId: string): ICompetencia | undefined {
	return competencias.find(comp => comp.id === compId);
}
