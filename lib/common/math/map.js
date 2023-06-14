import { lerp } from './lerp.js';
import { map01 } from './map01.js';

export const map = (
	/** @type {number} */ t,
	/** @type {number} */ rangeStart,
	/** @type {number} */ rangeEnd,
	/** @type {number} */ domainStart,
	/** @type {number} */ domainEnd,
) => lerp(map01(t, rangeStart, rangeEnd), domainStart, domainEnd);
