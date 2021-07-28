import { PickPropsInU, RequiredAndNotNull, TsPrimitiveTypes } from '../Utility';
import { IEvaluacion } from '../Entity/IEvaluaciones';
import { IEvModelGetDTO, ICCompDTO } from '.';

/**
 * Dto a usar cuando se quiere mandar al backend una petición para crear una nueva evaluación
 * @author aml360 <aml360esp@gmail.com>
 */
export type IEvSendDTO = Omit<IEvAllRequiredDTO, 'id' | 'isShowingResults'> & {
	//?? Recomendable mandar siempre isShowingResults? Default en db es false
	isShowingResults?: boolean;
};

//TODO: Tsdoc
export type IEvAllRequiredDTO = PickPropsInU<RequiredAndNotNull<IEvaluacion>, TsPrimitiveTypes> & {
	model: IEvModelGetDTO;
	catComp: ICCompDTO;
};

export type IEvWithModelGetDTO = PickPropsInU<RequiredAndNotNull<IEvaluacion>, TsPrimitiveTypes> & {
	model: IEvModelGetDTO;
};

export type IEvUpdateDTO = IEvSendDTO;

export type IUpdateEvShowingResultsDTO = RequiredAndNotNull<Pick<IEvaluacion, 'id' | 'isShowingResults'>>;
