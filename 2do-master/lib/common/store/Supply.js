/** @template T */
export class Supply {
	/** @type {import('./Store.js').Store<T>} */
	#store;

	get v() {
		return this.#store.v;
	}

	constructor(/** @type {import('./Store.js').Store<T>} */ store) {
		this.#store = store;
	}

	subscribe(/** @type {(v: T) => void} */ subscriber) {
		return this.#store.subscribe(subscriber);
	}

	subscribeLazy(/** @type {(v: T) => void} */ subscriber) {
		return this.#store.subscribeLazy(subscriber);
	}

	unsubscribe(/** @type {(v: T) => void} */ subscriber) {
		this.#store.unsubscribe(subscriber);
	}

	destroy() {
		this.#store.destroy();
	}
}
