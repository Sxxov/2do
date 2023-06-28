import { cssT } from '../common/lit/runtime/traits/cssT.js';
import { strT } from '../common/lit/runtime/types/strT.js';
import { X, css, html } from '../common/x/X.js';

export class LoaderSkeleton extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		width: strT(cssT),
		height: strT(cssT),
		colour: strT(cssT),
		delay: strT(cssT),
	};

	constructor() {
		super();

		/** @type {string} */ this.width = '100%';
		/** @type {string} */ this.height = '100%';
		/** @type {string} */ this.colour = 'var(----colour-text-secondary)';
		/** @type {string} */ this.delay = '0s';
	}

	/** @override */
	render() {
		return html``;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			:host {
				display: block;
				position: relative;

				width: var(--width);
				height: var(--height);

				opacity: 0;
				background: var(--colour);
				border-radius: var(----roundness);

				animation: x-loader-skeleton--pulse 1s var(--delay) infinite
					var(----ease-slow-slow);
			}

			@keyframes x-loader-skeleton--pulse {
				0% {
					opacity: 0.2;
				}

				50% {
					opacity: 0.1;
				}

				100% {
					opacity: 0.2;
				}
			}
		`,
	];
}
customElements.define('x-loader-skeleton', LoaderSkeleton);
