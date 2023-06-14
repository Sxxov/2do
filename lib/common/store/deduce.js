import { Store } from './Store.js';

/**
 * @template {(
 * 	| import('./Store.js').Store<any>
 * 	| import('./Supply.js').Supply<any>
 * )[]} T
 * @template {(...values: { [k in keyof T]: T[k]['v'] }) => any} Callback
 */
export const deduce = (
	/** @type {T} */ stores,
	/** @type {Callback} */ callback,
) => {
	let values = stores.map((store) => store.v);
	const /** @type {Store<ReturnType<Callback>>} */ out = new Store(
			callback(.../** @type {any} */ (values)),
		);

	const subscriber = () => {
		const newValues = stores.map((store) => store.v);

		if (values.some((value, i) => value !== newValues[i]))
			out.v = callback(.../** @type {any} */ (newValues));

		values = newValues;
	};

	for (const store of stores) store.subscribeLazy(subscriber);

	return out.supply;
};
