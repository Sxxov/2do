import { clamp } from './clamp.js';

export const clamp01 = (/** @type {number} */ t) => clamp(t, 0, 1);
