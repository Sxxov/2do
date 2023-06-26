import { whenResize } from '../common/actions/when/whenResize.js';
import { Composition } from '../common/animation/Composition.js';
import { Tween } from '../common/animation/Tween.js';
import { bezierExpoOut } from '../common/bezier/beziers/bezierExpoOut.js';
import { bondage } from '../common/functional/bondage.js';
import { resolveClientCoordinates } from '../common/input/resolveClientCoordinates.js';
import { Cleaner } from '../common/lit/lifecycle/Cleaner.js';
import { stateT } from '../common/lit/runtime/traits/stateT.js';
import { arrT } from '../common/lit/runtime/types/arrT.js';
import { numT } from '../common/lit/runtime/types/numT.js';
import { strT } from '../common/lit/runtime/types/strT.js';
import { clamp } from '../common/math/clamp.js';
import { deduce } from '../common/store/deduce.js';
import { s } from '../common/store/s.js';
import { X, css, html } from '../common/x/X.js';

export class Ripples extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		width: strT,
		height: strT,
		sizeMin: numT,
		sizeMax: numT,
		opacityIn: numT,
		opacityOut: numT,
		durationMin: numT,
		durationMax: numT,

		rippleData: arrT(stateT),
	};

	static #gradientId = 'x-ripples--gradient';

	#cleaner = new Cleaner();

	#defs = (() => {
		const defs = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'defs',
		);
		const gradient = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'radialGradient',
		);
		gradient.setAttribute('id', Ripples.#gradientId);
		const stop1 = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'stop',
		);
		stop1.setAttribute('offset', '0%');
		stop1.setAttribute('stop-color', 'var(----colour-text-transparent)');
		const stop2 = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'stop',
		);
		stop2.setAttribute('offset', '40%');
		stop2.setAttribute('stop-color', 'var(----colour-text-secondary)');
		const stop3 = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'stop',
		);
		stop3.setAttribute('offset', '80%');
		stop3.setAttribute('stop-color', 'var(----colour-text-tertiary)');
		const stop4 = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'stop',
		);
		stop4.setAttribute('offset', '100%');
		stop4.setAttribute('stop-color', 'var(----colour-text-transparent)');

		gradient.append(stop1, stop2, stop3, stop4);
		defs.append(gradient);

		return defs;
	})();

	#width = s(0);
	#height = s(0);

	#size = deduce([this.#width, this.#height], (width, height) =>
		clamp(
			Math.hypot(width / 2, height / 2) * 8,
			this.sizeMin,
			this.sizeMax,
		),
	);

	get sizeOut() {
		return this.#size.v;
	}

	#duration = deduce([this.#size], (size) =>
		clamp(size / 2, this.durationMin, this.durationMax),
	);

	get duration() {
		return this.#duration.v;
	}

	constructor() {
		super();

		/** @type {string} */ this.width;
		this.width = '100%';
		/** @type {string} */ this.height;
		this.height = '100%';
		/** @type {number} */ this.sizeMin;
		this.sizeMin = 560;
		/** @type {number} */ this.sizeMax;
		this.sizeMax = Infinity;
		/** @type {number} */ this.opacityIn;
		this.opacityIn = 0.7;
		/** @type {number} */ this.opacityOut;
		this.opacityOut = 0;
		/** @type {number} */ this.durationMin;
		this.durationMin = 600;
		/** @type {number} */ this.durationMax;
		this.durationMax = 3000;

		/**
		 * @type {{
		 * 	x: number;
		 * 	y: number;
		 * 	size: number;
		 * 	opacity: number;
		 * 	circle: SVGCircleElement;
		 * }[]}
		 */ this.rippleData;
		this.rippleData = [];
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();

		this.#cleaner.add(
			(this.addEventListener('touchstart', this.#onDown, {
				passive: true,
			}),
			() => {
				this.removeEventListener('touchstart', this.#onDown);
			}),
			(this.addEventListener('mousedown', this.#onDown),
			() => {
				this.removeEventListener('mousedown', this.#onDown);
			}),
			(this.addEventListener('touchend', this.#onUp),
			() => {
				this.removeEventListener('touchend', this.#onUp);
			}),
			(this.addEventListener('mouseup', this.#onUp),
			() => {
				this.removeEventListener('mouseup', this.#onUp);
			}),
			bondage(
				whenResize(this, ({ width, height }) => {
					[this.#width.v, this.#height.v] = [width, height];
				}),
			).destroy,
		);
	}

	/** @override */
	disconnectedCallback() {
		super.disconnectedCallback();

		this.#cleaner.flush();
	}

	#isTouching = false;
	#onDown = (/** @type {MouseEvent | TouchEvent} */ event) => {
		if (typeof TouchEvent !== 'undefined' && event instanceof TouchEvent)
			this.#isTouching = true;

		const [eventX, eventY] = resolveClientCoordinates(event);
		const { x: elemX, y: elemY } = /** @type {HTMLElement} */ (
			event.currentTarget
		).getBoundingClientRect();
		const [rippleX, rippleY] = [eventX - elemX, eventY - elemY];

		if (
			typeof MouseEvent !== 'undefined' &&
			event instanceof MouseEvent &&
			this.#isTouching
		)
			return;

		const circle = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'circle',
		);
		circle.style.setProperty('fill', `url(#${Ripples.#gradientId})`);
		const data = {
			x: rippleX,
			y: rippleY,
			size: this.#size.v / 20,
			opacity: this.opacityIn,
			circle,
		};

		this.rippleData.push(data);

		const tweenSize = new Tween(
			this.#size.v / 20,
			this.sizeOut,
			this.duration,
		);
		tweenSize.subscribe((size) => {
			data.size = size;
			this.requestUpdate('rippleData');
		});
		const tweenOpacity = new Tween(
			this.opacityIn,
			this.opacityOut,
			this.duration,
			bezierExpoOut,
		);
		tweenOpacity.subscribe((opacity) => {
			data.opacity = opacity;
			this.requestUpdate('rippleData');
		});
		new Composition([
			{
				tween: tweenSize,
			},
			{
				tween: tweenOpacity,
			},
		])
			.play()
			.then(() => {
				this.rippleData.splice(this.rippleData.indexOf(data), 1);
				this.requestUpdate('rippleData');
			});
	};

	#onUp = (/** @type {MouseEvent | TouchEvent} */ event) => {
		if (typeof TouchEvent !== 'undefined' && event instanceof TouchEvent)
			this.#isTouching = false;
	};

	/** @override */
	render() {
		return html`
			<svg xmlns="http://www.w3.org/2000/svg">
				${this.#defs}
				${this.rippleData.map(({ x, y, size, opacity, circle }) => {
					circle.setAttribute('cx', String(x));
					circle.setAttribute('cy', String(y));
					circle.setAttribute('r', String(size));
					circle.setAttribute('opacity', String(opacity));

					return circle;
				})}
			</svg>
		`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			:host {
				display: block;

				width: 100%;
				height: 100%;

				mix-blend-mode: overlay;
			}

			svg {
				width: 100%;
				height: 100%;
			}
		`,
	];
}
customElements.define('x-ripples', Ripples);
