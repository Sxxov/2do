/**
 * BezierEasing - use bezier curve for transition easing function by Gaëtan
 * Renaudeau 2014 - 2015 – MIT License
 *
 * @see https://github.com/gre/bezier-easing
 */
export class Bezier {
	/** @type {number} */
	#x1;
	/** @type {number} */
	#y1;
	/** @type {number} */
	#x2;
	/** @type {number} */
	#y2;
	/** @type {Float32Array | number[]} */
	#sampleValues;

	constructor(
		/** @type {number} */ x1,
		/** @type {number} */ y1,
		/** @type {number} */ x2,
		/** @type {number} */ y2,
	) {
		this.#x1 = x1;
		this.#y1 = y1;
		this.#x2 = x2;
		this.#y2 = y2;
		this.#sampleValues =
			typeof Float32Array === 'function'
				? new Float32Array(11 /* BezierConstants.SPLINE_TABLE_SIZE */)
				: new Array(11 /* BezierConstants.SPLINE_TABLE_SIZE */);
		if (x1 !== y1 || x2 !== y2)
			// calculate sample values
			for (
				let i = 0;
				i < 11 /* BezierConstants.SPLINE_TABLE_SIZE */;
				++i
			) {
				this.#sampleValues[i] = Bezier.calcBezier(
					i * 0.1 /* BezierConstants.SAMPLE_STEP_SIZE */,
					x1,
					x2,
				);
			}
	}

	at(/** @type {number} */ v) {
		if (this.#x1 === this.#y1 && this.#x2 === this.#y2) return v;
		return Bezier.calcBezier(
			this.getTforX(v, this.#x1, this.#x2),
			this.#y1,
			this.#y2,
		);
	}

	getTforX(
		/** @type {number} */ aX,
		/** @type {number} */ mX1,
		/** @type {number} */ mX2,
	) {
		let intervalStart = 0;
		let currentSampleIndex = 1;
		const FINAL_SAMPLE_INDEX =
			11 /* BezierConstants.SPLINE_TABLE_SIZE */ - 1;
		while (
			currentSampleIndex !== FINAL_SAMPLE_INDEX &&
			Number(this.#sampleValues[currentSampleIndex]) <= aX
		) {
			intervalStart += 0.1 /* BezierConstants.SAMPLE_STEP_SIZE */;
			++currentSampleIndex;
		}

		--currentSampleIndex;
		const currentSample = Number(this.#sampleValues[currentSampleIndex]);
		const nextSample = Number(this.#sampleValues[currentSampleIndex + 1]);
		// interpolate to provide an initial guess for t
		const dist = (aX - currentSample) / (nextSample - currentSample);
		const guessForT =
			intervalStart + dist * 0.1; /* BezierConstants.SAMPLE_STEP_SIZE */
		const initialSlope = Bezier.getSlope(guessForT, mX1, mX2);
		if (initialSlope >= 0.001 /* BezierConstants.NEWTON_MIN_SLOPE */)
			return Bezier.newtonRaphsonIterate(aX, guessForT, mX1, mX2);
		if (initialSlope === 0) return guessForT;
		return Bezier.binarySubdivide(
			aX,
			intervalStart,
			intervalStart + 0.1 /* BezierConstants.SAMPLE_STEP_SIZE */,
			mX1,
			mX2,
		);
	}

	static a(/** @type {number} */ aA1, /** @type {number} */ aA2) {
		return 1 - 3 * aA2 + 3 * aA1;
	}

	static b(/** @type {number} */ aA1, /** @type {number} */ aA2) {
		return 3 * aA2 - 6 * aA1;
	}

	static c(/** @type {number} */ aA1) {
		return 3 * aA1;
	}

	// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
	static calcBezier(
		/** @type {number} */ aT,
		/** @type {number} */ aA1,
		/** @type {number} */ aA2,
	) {
		return (
			((Bezier.a(aA1, aA2) * aT + Bezier.b(aA1, aA2)) * aT +
				Bezier.c(aA1)) *
			aT
		);
	}

	// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
	static getSlope(
		/** @type {number} */ aT,
		/** @type {number} */ aA1,
		/** @type {number} */ aA2,
	) {
		return (
			3 * Bezier.a(aA1, aA2) * aT * aT +
			(2 * Bezier.b(aA1, aA2) * aT + Bezier.c(aA1))
		);
	}

	static binarySubdivide(
		/** @type {number} */ aX,
		/** @type {number} */ aA,
		/** @type {number} */ aB,
		/** @type {number} */ mX1,
		/** @type {number} */ mX2,
	) {
		let currentX;
		let currentT;
		let i = 0;
		do {
			currentT = aA + (aB - aA) / 2;
			currentX = Bezier.calcBezier(currentT, mX1, mX2) - aX;
			if (currentX > 0) aB = currentT;
			else aA = currentT;
		} while (
			Math.abs(currentX) >
				1e-7 /* BezierConstants.SUBDIVISION_PRECISION */ &&
			++i < 10 /* BezierConstants.SUBDIVISION_MAX_ITERATIONS */
		);

		return currentT;
	}

	static newtonRaphsonIterate(
		/** @type {number} */ aX,
		/** @type {number} */ aGuessT,
		/** @type {number} */ mX1,
		/** @type {number} */ mX2,
	) {
		for (let i = 0; i < 4 /* BezierConstants.NEWTON_ITERATIONS */; ++i) {
			const currentSlope = Bezier.getSlope(aGuessT, mX1, mX2);
			if (currentSlope === 0) return aGuessT;
			const currentX = Bezier.calcBezier(aGuessT, mX1, mX2) - aX;
			aGuessT -= currentX / currentSlope;
		}

		return aGuessT;
	}
}
