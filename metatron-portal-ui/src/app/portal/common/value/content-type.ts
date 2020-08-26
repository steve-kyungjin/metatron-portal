/**
 * Supported content type to be automatically associated with a {@link Request}.
 * @experimental
 */
export enum ContentType {
	// noinspection JSUnusedGlobalSymbols
	NONE = 0,
	JSON = 1,
	FORM = 2,
	FORM_DATA = 3,
	TEXT = 4,
	BLOB = 5,
	ARRAY_BUFFER = 6,
}
