/**
 * @template {Record<any, any>} T
 * @returns {T}
 */
export const bondage = (/** @type {T} */ obj) => {
	return new Proxy(obj, {
		get(
			/** @type {any} */ target,
			/** @type {string} */ prop,
			/** @type {any} */ receiver,
		) {
			const value = Reflect.get(target, prop, receiver);
			if (typeof value === 'function') return value.bind(target);

			return value;
		},
	});
};
