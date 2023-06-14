import { bezierLinear } from '../bezier/beziers/bezierLinear.js';
import { noop } from '../functional/noop.js';
import { clamp01 } from '../math/clamp01.js';
import { map } from '../math/map.js';
import { Store } from '../store/Store.js';
import { Supply } from '../store/Supply.js';

/** @extends {Supply<number>} */
export class Tween extends Supply {
	/** @type {Store<number>} */
	#store;
	/** @type {number | undefined} */
	#rafHandle = undefined;

	#progress = 0;
	get progress() {
		return this.#progress;
	}

	#isPlaying = false;
	get isPlaying() {
		return this.#isPlaying;
	}

	#playResolve = noop;

	/** @type {number} */
	#start;
	get start() {
		return this.#start;
	}

	/** @type {number} */
	#end;
	get end() {
		return this.#end;
	}

	/** @type {number} */
	#duration;
	get duration() {
		return this.#duration;
	}

	/** @type {{ at(progress: number): number }} */
	#bezier = bezierLinear;
	get bezier() {
		return this.#bezier;
	}

	get length() {
		return this.#end - this.#start;
	}

	constructor(
		/** @type {number} */ start,
		/** @type {number} */ end,
		/** @type {number} */ duration,
		/** @type {{ at(progress: number): number }} */ bezier = bezierLinear,
	) {
		const store = new Store(start);
		super(store);
		this.#store = store;

		this.#start = start;
		this.#end = end;
		this.#duration = duration;
		this.#bezier = bezier;
	}

	async play(direction = 1) {
		if (this.#rafHandle) cancelAnimationFrame(this.#rafHandle);
		if (direction === 0) return;

		const initialProgress = this.#progress;
		let /** @type {number} */ startTime;
		let /** @type {number} */ endTime;

		this.#isPlaying = true;

		const promise = new /** @type {typeof Promise<void>} */ (Promise)(
			(resolve) => {
				this.#playResolve = resolve;
			},
		);

		const step = (/** @type {DOMHighResTimeStamp} */ time) => {
			if (!this.#isPlaying) return;

			startTime ??= time;
			endTime ??=
				startTime +
				this.#duration *
					(direction > 0 ? 1 - initialProgress : initialProgress);

			this.seekToProgress(
				clamp01(
					initialProgress +
						((time - startTime) / this.#duration) * direction,
				),
			);

			if (time < endTime) this.#rafHandle = requestAnimationFrame(step);
			else {
				this.seekToProgress(direction > 0 ? 1 : 0);
				this.pause();
			}
		};

		this.#rafHandle = requestAnimationFrame(step);

		await promise;
	}

	pause() {
		if (this.#rafHandle) {
			cancelAnimationFrame(this.#rafHandle);
			this.#rafHandle = undefined;
		}

		this.#isPlaying = false;
		this.#playResolve();
	}

	stop() {
		this.pause();

		this.#store.v = this.#start;
	}

	seekToProgress(/** @type {number} */ progress) {
		this.#store.v = map(
			this.#bezier.at(progress),
			0,
			1,
			this.#start,
			this.#end,
		);
		this.#progress = progress;
	}

	seekToTime(/** @type {number} */ time) {
		this.seekToProgress(time / this.#duration);
	}

	seekToValue(/** @type {number} */ value) {
		this.seekToProgress(map(value, this.#start, this.#end, 0, 1));
	}

	/** @override */
	destroy() {
		this.stop();
		super.destroy();
	}
}
