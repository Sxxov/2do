import { Cleaner } from '../common/lit/lifecycle/Cleaner.js';
import { arrStT } from '../common/lit/runtime/arrStT.js';
import { boolT } from '../common/lit/runtime/boolT.js';
import { numStT } from '../common/lit/runtime/numStT.js';
import { strT } from '../common/lit/runtime/strT.js';
import { propsToCssVar } from '../common/lit/style/propsToCssVar.js';
import { X, css, html } from '../common/x/X.js';
import '../components/Ripples.js';

export class Button extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		colourBackground: strT,
		colourBackgroundHover: strT,
		colourBackgroundActive: strT,
		colourBackgroundDisabled: strT,
		colourText: strT,
		colourTextHover: strT,
		colourTextActive: strT,
		colourTextDisabled: strT,
		width: strT,
		height: strT,
		roundness: strT,
		disabled: boolT,
		type: strT,

		ripplePoints: arrStT,
		rippleSize: numStT,
		rippleDuration: numStT,
	};

	static formAssociated = true;

	/** @override */
	static variants =
		/** @satisfies {import('../common/x/X.js').Variants<Button>} */ ({
			primary: {
				'.colourBackground': 'var(----colour-accent-tertiary)',
				'.colourBackgroundHover': 'var(----colour-accent-secondary)',
				'.colourBackgroundActive': 'var(----colour-accent-secondary)',
				'.colourBackgroundDisabled': 'var(----colour-accent-tertiary)',
				'.colourText': 'var(----colour-accent-primary)',
				'.colourTextHover': 'var(----colour-accent-primary)',
				'.colourTextActive': 'var(----colour-accent-primary)',
				'.colourTextDisabled': 'var(----colour-accent-secondary)',
			},
			secondary: {
				'.colourBackground': 'var(----colour-background-secondary)',
				'.colourBackgroundHover': 'var(----colour-background-tertiary)',
				'.colourBackgroundActive':
					'var(----colour-background-tertiary)',
				'.colourBackgroundDisabled':
					'var(----colour-background-secondary)',
				'.colourText': 'var(----colour-text-primary)',
				'.colourTextHover': 'var(----colour-text-primary)',
				'.colourTextActive': 'var(----colour-text-primary)',
				'.colourTextDisabled': 'var(----colour-text-secondary)',
			},
		});

	#cleaner = new Cleaner();

	#internals = this.attachInternals();

	constructor() {
		super();

		/** @type {string} */ this.colourBackground =
			'var(----colour-accent-tertiary)';
		/** @type {string} */ this.colourBackgroundHover =
			'var(----colour-accent-secondary)';
		/** @type {string} */ this.colourBackgroundActive =
			this.colourBackgroundHover;
		/** @type {string} */ this.colourBackgroundDisabled =
			this.colourBackground;
		/** @type {string} */ this.colourText =
			'var(----colour-accent-primary)';
		/** @type {string} */ this.colourTextHover = this.colourText;
		/** @type {string} */ this.colourTextActive = this.colourText;
		/** @type {string} */ this.colourTextDisabled =
			'var(----colour-accent-secondary)';
		/** @type {string} */ this.width = 'max-content';
		/** @type {string} */ this.height = '56px';
		/** @type {string} */ this.roundness = 'var(----roundness)';
		/** @type {boolean} */ this.disabled = false;
		/** @type {'button' | 'submit' | 'reset'} */ this.type = 'button';

		/** @type {[x: number, y: number][]} */ this.ripplePoints = [];
		/** @type {number} */ this.rippleSize = 0;
		/** @type {number} */ this.rippleDuration = 0;
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();

		this.#cleaner.add();
	}

	/** @override */
	disconnectedCallback() {
		super.disconnectedCallback();

		this.#cleaner.flush();
	}

	/** @override */
	willUpdate(
		/** @type {import('lit-element').PropertyValues<this>} */ changedProperties,
	) {
		super.willUpdate(changedProperties);

		propsToCssVar(this, changedProperties.has.bind(changedProperties), [
			'colourBackground',
			'colourBackgroundHover',
			'colourBackgroundActive',
			'colourBackgroundDisabled',
			'colourText',
			'colourTextHover',
			'colourTextActive',
			'colourTextDisabled',
			'width',
			'height',
			'roundness',
		]);
	}

	/** @override */
	render() {
		return html`
			<button
				?disabled="${this.disabled}"
				type=${this.type}
				@click="${() => {
					if (this.disabled) return;
					if (this.type === 'submit')
						this.#internals.form?.dispatchEvent(
							new SubmitEvent('submit', { submitter: this }),
						);
					if (this.type === 'reset')
						this.#internals.form?.dispatchEvent(
							new Event('reset', { bubbles: true }),
						);
				}}"
			>
				<slot name="background">
					<div class="default background"></div>
				</slot>

				<slot name="content">
					<div class="default content">
						<slot name="left"><x-i>arrow_forward</x-i></slot>
						<slot></slot>
						<slot name="right"><x-i>_</x-i></slot>
					</div>
				</slot>

				<x-ripples></x-ripples>
			</button>
		`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			/* ——————————————————————————idle——————————————————————————— */

			:host {
				display: block;
				position: relative;

				height: var(--height);
				width: var(--width);

				border: var(--border);
				border-radius: var(--roundness);
			}

			button {
				position: relative;

				height: 100%;
				width: 100%;

				background: transparent;
				border: none;

				transform: matrix(1, 0, 0, 1, 0, 0);
				padding: 16px max(var(--roundness), 24px);
				box-sizing: border-box;

				cursor: pointer;

				border-radius: var(--roundness);

				color: var(--colour-text);
				font-family: var(----font-family-sans);
				font-size: 1em;
			}

			button .default.content {
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

			button .default.content .left,
			button .default.content .right {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 7px;
			}

			button .default.content slot[name='left']:not(:empty) {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 7px;

				margin-right: 7px;
			}

			button .default.content slot[name='right']:not(:empty) {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 7px;

				margin-left: 7px;
			}

			button .default.background {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;

				border-radius: var(--roundness);

				background: var(--colour-background);
				box-shadow: var(----shadow-inner-sm), var(----shadow-md);

				outline: solid 1px var(--colour-background);
				outline-offset: -1px;

				--transition: background 0.2s var(----ease-fast-slow),
					outline 0.3s var(----ease-slow-slow),
					box-shadow 0.3s var(----ease-fast-slow),
					transform 0.3s var(----ease-fast-slow);

				transition: var(--transition);
			}

			x-ripples {
				position: absolute;
				top: 0;
				left: 0;

				height: 100%;
				width: 100%;

				z-index: 1;

				border-radius: var(--roundness);

				overflow: hidden;
				overflow: clip;
			}

			/* ——————————————————————————hover————————————————————————— */

			/*
			replaces \`@media (hover: none)\`
			https://www.ctrl.blog/entry/css-media-hover-samsung.html
		*/
			@media (pointer: fine) {
				button:hover .default.background {
					background: var(--colour-background-hover);
					outline: solid 1px var(--colour-background-hover);
					box-shadow: var(----shadow-inner-sm), var(----shadow-md);
				}

				button:hover * {
					color: var(--colour-text-hover);
				}
			}

			/* —————————————————————————active————————————————————————— */

			button:active .default.background {
				background: var(--colour-background-active);

				transition: var(--transition), outline 0s;
				box-shadow: var(----shadow-inner-md), var(----shadow-none);
				outline: solid 1px var(--colour-background-hover);
			}

			@media (pointer: coarse) {
				button:active {
					background: var(--colour-background-hover);
				}

				button:active * {
					color: var(--colour-text-hover);
				}
			}

			/* ————————————————————————disabled———————————————————————— */

			button:disabled {
				cursor: not-allowed;
			}

			button:disabled .default.background {
				background: var(--colour-background-disabled);
			}
		`,
	];
}

customElements.define('x-button', Button);
