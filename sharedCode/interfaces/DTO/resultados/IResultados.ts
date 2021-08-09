export interface IResultadoDTO {
	maxResult: number;
	minResult: number;
	inferiores: number;
	superiores: number;
	pares: number;
	competencia: string;
	// clientes?:
}

export interface IResultadoDTOV2 {
	maxResult: number;
	minResult: number;
	values: Array<{
		// TODO: tsdoc, es quien compone el result, por ejemplo inferiores, pares, superiores, externos, clientes, etc
		name: string;
		// TODO: tsdoc, valor del resultado, por ejemplo 20, 35.43, -10.5, siempre en rango de maxResult y minResult
		value: number;
	}>;
	competencia: string;
}
