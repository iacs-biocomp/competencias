/**
 * @version 0.0.1
 */
export type IFrontLoggingPayloadV0_0_1 = {
	/** Max 100 characters long */
	message: string;
	component?: string;
	/** Actual URI */
	current_URI?: string;
	/** Max 1000 characters long */
	stackTrace?: string;
};

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
 * Refered to latest Interface version.
 * @version 0.0.1
 */
export type IFrontLoggingPayload = IFrontLoggingPayloadV0_0_2;

// see https://blog.saleae.com/versioning-typescript-types/
