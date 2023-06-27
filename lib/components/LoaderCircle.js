import { cssT } from '../common/lit/runtime/traits/cssT.js';
import { numT } from '../common/lit/runtime/types/numT.js';
import { strT } from '../common/lit/runtime/types/strT.js';
import { X, css, html } from '../common/x/X.js';

export class LoaderCircle extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		width: strT(cssT),
		height: strT(cssT),
		colour: strT,
		colourSecondary: strT,
		weight: strT,
		completion: numT,
	};

	static #RADIUS = 100;
	static #CIRCUMFERENCE = 2 * Math.PI * this.#RADIUS;

	constructor() {
		super();

		/** @type {string} */ this.width = '100%';
		/** @type {string} */ this.height = '100%';
		/** @type {string} */ this.colour = 'var(----colour-accent-primary)';
		/** @type {string} */ this.colourSecondary =
			'var(----colour-accent-secondary)';
		/** @type {string} */ this.weight = '5px';
		/** @type {number} */ this.completion = NaN;
	}

	/** @override */
	render() {
		return html`
			<svg
				class="circle"
				height="100%"
				width="100%"
				viewBox="0 0 ${LoaderCircle.#RADIUS * 2} ${LoaderCircle
					.#RADIUS * 2}"
				preserveAspectRatio="xMidYMid meet"
				vector-effect="non-scaling-stroke"
				style="
					--circumference: ${LoaderCircle.#CIRCUMFERENCE}px;
					--offset: ${Number.isNaN(this.completion)
					? 0
					: (1 - this.completion) * LoaderCircle.#CIRCUMFERENCE}px;
				"
			>
				<circle
					class="secondary ${this.completion <= 0 ||
					Number.isNaN(this.completion)
						? 'indeterminate'
						: ''}"
					cx=${LoaderCircle.#RADIUS}
					cy=${LoaderCircle.#RADIUS}
					r="calc(${LoaderCircle.#RADIUS}px - ${this.weight})"
					fill="none"
					stroke=${this.colour}
					stroke-width=${this.weight}
					transform="rotate(-90 ${LoaderCircle.#RADIUS} ${LoaderCircle
						.#RADIUS})"
				/>
				<circle
					class="primary ${this.completion <= 0 ||
					Number.isNaN(this.completion)
						? 'indeterminate'
						: ''}"
					cx=${LoaderCircle.#RADIUS}
					cy=${LoaderCircle.#RADIUS}
					r="calc(${LoaderCircle.#RADIUS}px - ${this.weight})"
					fill="none"
					stroke=${this.colour}
					stroke-width=${this.weight}
					transform="rotate(-90 ${LoaderCircle.#RADIUS} ${LoaderCircle
						.#RADIUS})"
				/>
			</svg>
		`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			:host {
				position: relative;
				height: var(--height);
				width: var(--width);
			}

			.circle {
				position: absolute;
				top: 0;
				left: 0;

				animation: x-loader-circle--rotation 2s var(----ease-slow-slow)
					normal infinite;
			}

			@keyframes x-loader-circle--rotation {
				0% {
					transform: rotate(0deg);
				}

				100% {
					transform: rotate(360deg);
				}
			}

			.circle > circle {
				stroke-dasharray: var(--circumference);

				transition: all 1s var(----ease-slow-slow);
			}

			.circle > circle.primary {
				stroke-dashoffset: var(--offset);
			}

			.circle > circle.indeterminate.primary {
				animation: x-loader-circle--indeterminate 3s
					cubic-bezier(0.5, 0, 0.5, 1) normal infinite;
			}

			.circle > circle.indeterminate.secondary {
				animation: x-loader-circle--indeterminate 3s
					cubic-bezier(0.5, 0, 1, 1) normal infinite;
			}

			@keyframes x-loader-circle--indeterminate {
				0% {
					stroke-dashoffset: calc(var(--circumference) * 2);
				}

				100% {
					stroke-dashoffset: 0;
				}
			}
		`,
	];
}
customElements.define('x-loader-circle', LoaderCircle);
