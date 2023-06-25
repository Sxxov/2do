export const clamp = (
	/** @type {number} */ t,
	/** @type {number} */ min,
	/** @type {number} */ max,
) => Math.min(Math.max(t, min), max);
