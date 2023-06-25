import { Supply } from './Supply.js';

/** @template T */
export class Store {
	/** @type {((v: T) => void)[]} */
	subscribers = [];

	/** @type {T} */
	#v;

	get v() {
		return this.#v;
	}

	set v(v) {
		this.#v = v;

		for (const subscriber of this.subscribers) subscriber(v);
	}

	/** @type {Supply<T> | undefined} */
	#supply;

	get supply() {
		return (this.#supply ??= new Supply(this));
	}

	constructor(/** @type {T} */ v) {
		this.#v = v;
	}

	subscribe(/** @type {(v: T) => void} */ subscriber) {
		this.subscribers.push(subscriber);

		subscriber(this.#v);

		return () => this.unsubscribe(subscriber);
	}

	subscribeLazy(/** @type {(v: T) => void} */ subscriber) {
		this.subscribers.push(subscriber);

		return () => this.unsubscribe(subscriber);
	}

	unsubscribe(/** @type {(v: T) => void} */ subscriber) {
		const i = this.subscribers.indexOf(subscriber);

		if (i !== -1) this.subscribers.splice(i, 1);
	}

	destroy() {
		this.subscribers = [];
		this.#supply = undefined;
	}
}
