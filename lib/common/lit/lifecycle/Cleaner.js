export class Cleaner {
	/** @type {(() => void)[]} */
	#looseEnds = [];

	add(/** @type {(() => void)[]} */ ...looseEnds) {
		this.#looseEnds.push(...looseEnds);
	}

	flush() {
		for (const looseEnd of this.#looseEnds) looseEnd();
		this.#looseEnds = [];
	}
}
