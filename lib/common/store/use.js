/**
 * @template {readonly (
 * 	| import('./Store.js').Store<any>
 * 	| import('./Supply.js').Supply<any>
 * )[]} T
 */
export const use = (
	/** @type {T} */ stores,
	/** @type {(values: { [k in keyof T]: T[k]['v'] }) => void} */ callback,
) => {
	const values = stores.map((store) => store.v);

	const subscriber = () => {
		const newValues = stores.map((store) => store.v);

		if (values.some((value, i) => value !== newValues[i]))
			callback(/** @type {any} */ (newValues));

		values.splice(0, values.length, ...newValues);
	};

	for (const store of stores) store.subscribeLazy(subscriber);

	subscriber();

	return () => {
		for (const store of stores) store.unsubscribe(subscriber);
	};
};
