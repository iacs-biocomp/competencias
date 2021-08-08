import { IResultadoDTO } from 'sharedInterfaces/DTO';

export const EV_RESULTS_SAMPLE: IResultadoDTO[] = [
	{
		inferiores: 10,
		pares: 20,
		superiores: 30,
		maxResult: 30,
		minResult: 0,
		competencia: 'C1',
	},
	{
		inferiores: 30,
		pares: 20,
		superiores: 10,
		maxResult: 30,
		minResult: 0,
		competencia: 'C2',
	},
	{
		inferiores: 65,
		pares: 40,
		superiores: -3,
		maxResult: 65,
		minResult: -3,
		competencia: 'C3',
	},
];

export const resultExample = [
	{
		name: 'Inferiores',
		value: 10,
	},
	{
		name: 'Pares',
		value: 20,
	},
	{
		name: 'Superiores',
		value: 30,
	},
];
