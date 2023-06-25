/**
 * Maps {@linkcode t} from the range {@linkcode rangeStart} to {@linkcode rangeEnd}
 * to the range 0 to 1, without clamping it.
 *
 * @example
 * 	map01(50, 0, 100); // 0.5
 * 	map01(200, 0, 100); // 2
 * 	map01(-50, 0, 100); // -0.5
 */
export const map01 = (
	/** @type {number} */ t,
	/** @type {number} */ rangeStart,
	/** @type {number} */ rangeEnd,
) => (t - rangeStart) / (rangeEnd - rangeStart);
