/** @template T */
export const lazy = (/** @type {() => T} */ factory) => {
	let /** @type {T | undefined} */ value;
	return () => (value ??= factory());
};
