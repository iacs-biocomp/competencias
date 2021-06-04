import { Pipe, PipeTransform } from '@angular/core';
import { checkNivOnComp } from 'sharedCode/Utility';
import { ICompetencia, INivel, ISubModel } from 'sharedInterfaces/Entity';

/**
 * Filtra niveles eliminando aquellos que en cierta competencia no tienen comportamientos asociados
 */
@Pipe({
	name: 'haveComportFilter',
})
export class NivComportFilterPipe implements PipeTransform {
	/**
	 *
	 * @param niveles El array de niveles a filtrar
	 * @param subModels Los subModelos que usará el pipe para efectuar el filtrado
	 * @param comp La competencia actual, la cual se usa para obtener solo los subModelos con esa comp, puede ser su id como string
	 * @returns Un array de niveles los cuales tienen algun comportamiento asociado en esa competencia que se pasa como parametro
	 */
	transform(niveles: INivel[], subModels: ISubModel[], comp: ICompetencia | string): INivel[] {
		return niveles.filter(n => checkNivOnComp(n, comp, subModels));
	}
}
