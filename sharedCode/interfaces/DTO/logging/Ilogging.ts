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

/**
 * Refered to latest Interface version.
 * @version 0.0.1
 */
export type IFrontLoggingPayload = IFrontLoggingPayloadV0_0_1;

// see https://blog.saleae.com/versioning-typescript-types/
