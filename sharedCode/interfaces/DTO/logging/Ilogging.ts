/**
 * @version 0.0.2
 */
export type IFrontLoggingPayloadV0_0_2 = {
	/** Max 100 characters long */
	msg: string;
	date: Date;
	[index: string]: unknown;
	[index: number]: unknown;
	component?: string;
	/** Actual URI */
	current_URI?: string;
	/** Max 1000 characters long */
	stackTrace?: string;
};

/**
 * @version 0.0.3
 */
export type IFrontLoggingPayloadV0_0_3 = {
	/** Max 100 characters long */
	msg: string;
	date: Date;
	level: LogLevels;
	[index: string]: unknown;
	[index: number]: unknown;
	component?: string;
	/** Actual URI */
	current_URI?: string;
	/** Max 1000 characters long */
	stackTrace?: string;
};

/**
 * Refered to latest Interface version.
 * @version 0.0.3
 */
export type IFrontLoggingPayload = IFrontLoggingPayloadV0_0_3;

export enum LogLevels {
	ERROR = 0,
	WARN = 1,
	LOG = 2,
	DEBUG = 3,
	VERBOSE = 4,
}

// see https://blog.saleae.com/versioning-typescript-types/
