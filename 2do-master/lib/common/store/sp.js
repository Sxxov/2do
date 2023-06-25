import { Store } from './Store.js';

/** @template T */
export const sp = (/** @type {T} */ v) => new Store(v).supply;
