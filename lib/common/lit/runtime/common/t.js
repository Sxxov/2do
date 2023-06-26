/**
 * @template {import('lit-element').PropertyDeclaration} Def
 * @returns {Def & {
 * 	(...traits: import('lit-element').PropertyDeclaration[]): Def &
 * 		import('lit-element').PropertyDeclaration;
 * }}
 */
export const t = (/** @type {Def} */ def) => {
	const fn = (
		/** @type {import('lit-element').PropertyDeclaration[]} */ ...traits
	) => Object.assign({ ...def }, ...traits);

	Object.assign(fn, def);

	return /** @type {any} */ (fn);
};
