/** A different result tuple, which will never return an error */
declare type ResultCorrect<Ok> = readonly [
	result: Ok | undefined,
	error: undefined,
];

/**
 * A different result tuple, which permits any combination of result & error.
 * Useful for functions that have error correction, which will still produce a
 * result after encountering an error, but does also doesn't want to swallow
 * said error(s)
 */
declare type ResultLax<Ok, Err extends Error = Error> =
	| readonly [
			result: Ok | undefined,
			error: readonly [Err, ...Err[]] | undefined,
	  ];

/**
 * A different result tuple, which encourages reasons (errors) to be returned,
 * by requiring it if the result is `undefined`, & allowing it anyways
 * regardless of the result
 */
declare type ResultReasoned<Ok, Err extends Error = Error> =
| readonly [result: Ok | undefined, error: readonly [Err, ...Err[]]]
| readonly [result: Ok, error: readonly [Err, ...Err[]] | undefined]
| readonly [result: Ok, error: undefined]
| readonly [result: undefined, error: readonly [Err, ...Err[]]];

/**
 * A different result tuple, which requires a result, but allows reporting of
 * errors that was encountered during the function's execution
 */
declare type ResultRequired<Ok, Err extends Error = Error> =
	| readonly [result: Ok, error: readonly [Err, ...Err[]] | undefined];

/**
 * A typical result tuple, like the one in Rust, where you must have either a
 * result or an error, but not both
 */
declare type ResultStrict<Ok, Err extends Error = Error> =
| readonly [result: Ok, error: undefined]
| readonly [result: undefined, error: readonly [Err, ...Err[]]];

/**
 * A different result tuple, which allows for branching, where you can have
 * either a result or an error, but not both, but the error can be a list of
 * errors
 */
declare type ResultBranched<Ok, Nok, Err extends Error = Error> =
	| readonly [result: Ok, error: undefined]
	| readonly [result: Nok, error: readonly [Err, ...Err[]]];

/**
 * A different result tuple, that only returns void, but allows for reporting
 * of errors that was encountered during the function's execution
 * 
 * Equivalent to `ResultRequired<void, Err>`
 */
declare type ResultVoid<Err extends Error = Error> =
	| readonly [result: undefined, error: readonly [Err, ...Err[]] | undefined];