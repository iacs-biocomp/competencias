export interface ICatalog {
	dataset: [IDataset];
	master: [IMaster];
}
export interface IDataset {
	name: string;
	description: string;
	recNumber: number;
	from_dt: Date;
	to_dt: Date;
}
export interface IMaster {
	name: string;
	description: string;
	recNumber: number;
	from_dt: Date;
	to_dt: Date;
}
