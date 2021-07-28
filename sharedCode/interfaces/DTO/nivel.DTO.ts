import { INivel } from '../Entity';

export type INivNoId = Omit<INivel, 'id' | 'subModels'>;

type INivelBaseDTO = Omit<INivel, 'id' | 'subModels'>;

export type INivelGetDTO = INivelBaseDTO & Pick<INivel, 'id'>;

export type INivelAddDTO = INivelBaseDTO;

export type INivelPutDTO = INivelGetDTO;
