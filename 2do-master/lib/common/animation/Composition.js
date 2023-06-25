import { noop } from '../functional/noop.js';
import { clamp01 } from '../math/clamp01.js';

export class Composition {
	/** @type {{ tween: import('./Tween.js').Tween; delay?: number }[]} */ #timeline;

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

	get duration() {
		return this.#timeline.reduce(
			(duration, { tween, delay = 0 }) =>
				Math.max(duration, (delay ?? 0) + tween.duration),
			0,
		);
	}

	get length() {
		return this.#timeline.reduce(
			(length, { tween, delay = 0 }) =>
				Math.max(length, (delay ?? 0) + tween.length),
			0,
		);
	}

	constructor(
		/** @type {{ tween: import('./Tween.js').Tween; delay?: number }[]} */ timeline = [],
	) {
		this.#timeline = timeline;
	}

	add(/** @type {import('./Tween.js').Tween} */ tween, delay = 0) {
		this.#timeline.push({ tween, delay });
	}

	addIdentity(/** @type {import('./Tween.js').Tween} */ tween, delay = 0) {
		this.add(tween, delay);

		return tween;
	}

	delete(/** @type {import('./Tween.js').Tween} */ tween) {
		this.#timeline.splice(
			this.#timeline.findIndex((layer) => layer.tween === tween),
			1,
		);
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

		for (const layer of this.#timeline) layer.tween.pause();

		const step = (/** @type {DOMHighResTimeStamp} */ time) => {
			if (!this.#isPlaying) return;

			startTime ??= time;
			endTime ??=
				startTime +
				this.duration *
					(direction > 0 ? 1 - initialProgress : initialProgress);

			this.seekToProgress(
				clamp01(
					initialProgress +
						((time - startTime) / this.duration) * direction,
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

		for (const layer of this.#timeline) layer.tween.seekToProgress(0);
	}

	seekToProgress(/** @type {number} */ progress) {
		for (const { tween, delay = 0 } of this.#timeline) {
			const startTime = delay;
			const startProgress = startTime / this.duration;
			const endTime = delay + tween.duration;
			const endProgress = endTime / this.duration;
			const tweenProgress = clamp01(
				(progress - startProgress) / (endProgress - startProgress),
			);

			tween.seekToProgress(tweenProgress);
		}

		this.#progress = progress;
	}

	seekToTime(/** @type {number} */ time) {
		this.seekToProgress(time / this.duration);
	}

	seekToValue(/** @type {number} */ value) {
		this.seekToProgress(value / this.length);
	}

	destroy() {
		for (const layer of this.#timeline) layer.tween.destroy();
		this.#timeline.length = 0;
	}
}
