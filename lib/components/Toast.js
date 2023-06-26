import { Composition } from '../common/animation/Composition.js';
import { Tween } from '../common/animation/Tween.js';
import { bezierQuintIn } from '../common/bezier/beziers/bezierQuintIn.js';
import { bezierQuintOut } from '../common/bezier/beziers/bezierQuintOut.js';
import { Cleaner } from '../common/lit/lifecycle/Cleaner.js';
import { cssT } from '../common/lit/runtime/traits/cssT.js';
import { stateT } from '../common/lit/runtime/traits/stateT.js';
import { numT } from '../common/lit/runtime/types/numT.js';
import { strT } from '../common/lit/runtime/types/strT.js';
import { X, css, html } from '../common/x/X.js';
import './Button.js';
import './Spacer.js';

export class Toast extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		colourBackground: strT,
		colourBackgroundHover: strT,
		colourBackgroundActive: strT,
		colourText: strT,
		colourTextHover: strT,
		colourTextActive: strT,
		timeout: numT,
		icon: strT,

		progress: numT(stateT, cssT),
	};

	/** @override */
	static variants = {
		ok: {
			'.colourBackground': '#233b2b',
			'.colourBackgroundHover': '#84f59d33',
			'.colourBackgroundActive': '#6ccc8133',
			'.colourText': '#78e08f',
			'.colourTextHover': '#78e08f',
			'.icon': 'check',
		},
		warning: {
			'.colourBackground': '#3d301d',
			'.colourBackgroundHover': '#f7c15433',
			'.colourBackgroundActive': '#c7953033',
			'.colourText': '#f6b93b',
			'.colourTextHover': '#f6b93b',
			'.icon': 'warning',
		},
		error: {
			'.colourBackground': '#3e1e1e',
			'.colourBackgroundHover': '#ff696633',
			'.colourBackgroundActive': '#ba434133',
			'.colourText': '#eb4d4b',
			'.colourTextHover': '#eb4d4b',
			'.icon': 'error',
		},
	};

	#cleaner = new Cleaner();

	/** @type {Composition | undefined} */
	#comp;

	constructor() {
		super();

		/** @type {string} */ this.colourBackground;
		/** @type {string} */ this.colourBackgroundHover;
		/** @type {string} */ this.colourBackgroundActive;
		/** @type {string} */ this.colourText;
		/** @type {string} */ this.colourTextHover;
		/** @type {string} */ this.colourTextActive;

		/** @type {number} */ this.timeout = 3000;
		/** @type {number} */ this.progress = 0;
		/** @type {string} */ this.icon = 'info';
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();

		// 0..1, 1..1, 1..0
		const tweenIn = new Tween(0, 1, 300, bezierQuintOut);
		tweenIn.subscribe((value) => {
			if (value === 1) return;

			this.progress = value;
		});
		const tweenHold = new Tween(1, 1, this.timeout, bezierQuintIn);
		tweenIn.subscribe((value) => {
			this.progress = value;
		});
		const tweenOut = new Tween(1, 0, 300, bezierQuintIn);
		tweenOut.subscribe((value) => {
			if (value === 1) return;

			this.progress = value;
		});
		this.#comp = new Composition([
			{
				tween: tweenIn,
				delay: 0,
			},
			{
				tween: tweenHold,
				delay: 300,
			},
			{
				tween: tweenOut,
				delay: this.timeout + 300,
			},
		]);
		this.#comp.play().then(() => this.remove());

		console.log('attach');

		this.#cleaner.add(() => this.#comp?.stop());
	}

	/** @override */
	disconnectedCallback() {
		super.disconnectedCallback();

		console.log('detach');

		this.#cleaner.flush();
	}

	/** @override */
	render() {
		return html`
			<slot name="content" slot="content">
				<div class="default content">
					<x-button
						.colourBackground=${this.colourBackground}
						.colourBackgroundHover=${this.colourBackgroundHover}
						.colourBackgroundActive=${this.colourBackgroundActive}
						.colourText=${this.colourText}
						.colourTextHover=${this.colourTextHover}
						.colourTextActive=${this.colourTextActive}
						@click=${() => this.#comp?.pause()}
					>
						<slot name="left" slot="left"
							><x-i>${this.icon}</x-i
							><x-spacer width="7px"></x-spacer
						></slot>
						<slot></slot>
						<slot name="right" slot="right"></slot>
					</x-button>
				</div>
			</slot>
		`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			:host {
				display: block;
				position: relative;

				pointer-events: auto;

				transform: translateY(calc((1 - var(--progress)) * -20px));
				opacity: calc(var(--progress));
			}

			.default.content {
				position: relative;
				z-index: 1;
				width: 100%;
				height: 100%;

				display: flex;
				align-items: center;
				justify-content: space-between;

				text-align: center;

				user-select: none;
			}

			.default.content .left,
			.default.content .right {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 7px;
			}

			.default.content ::slotted([slot='left']) {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 7px;

				margin-right: 7px;
			}

			.default.content ::slotted([slot='right']) {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 7px;

				margin-left: 7px;
			}
		`,
	];
}
customElements.define('x-toast', Toast);
