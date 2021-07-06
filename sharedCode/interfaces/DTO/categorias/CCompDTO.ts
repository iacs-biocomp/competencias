import { RequiredAndNotNull } from '../../Utility';
import { ICatComp } from '../../Entity';

/**
 * Dto para añadir una nueva catComp
 * TODO: Completar documentación añadiendo que endpoints del backend usan este tipo
 */
export type CCompAddDTO = RequiredAndNotNull<Pick<ICatComp, 'description' | 'catContr'>>;
