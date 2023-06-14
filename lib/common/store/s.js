import { Store } from './Store.js';

/** @template T */
export const s = (/** @type {T} */ v) => new Store(v);
