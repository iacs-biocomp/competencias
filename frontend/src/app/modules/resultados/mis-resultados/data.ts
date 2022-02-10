import { IResultadoDTO, IResultadoDTOV2 } from 'sharedInterfaces/DTO';

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

export const RESULTS2: IResultadoDTOV2[] = [
	{
		values: [
			{
				name: 'inferiores',
				value: 55.2,
			},
			{
				name: 'superiores',
				value: 20.5,
			},
			{
				name: 'pares',
				value: 37.3,
			},
		],
		maxResult: 65,
		minResult: -5,
		competencia: 'C1',
	},
	{
		values: [
			{
				name: 'inferiores',
				value: -10,
			},
			{
				name: 'superiores',
				value: 15,
			},
			{
				name: 'pares',
				value: 25,
			},
		],
		maxResult: 30,
		minResult: -2.5,
		competencia: 'C2',
	},
	{
		values: [
			{
				name: 'inferiores',
				value: 0,
			},
			{
				name: 'superiores',
				value: 39.5,
			},
			{
				name: 'pares',
				value: 20,
			},
		],
		maxResult: 40,
		minResult: 0,
		competencia: 'C5',
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
