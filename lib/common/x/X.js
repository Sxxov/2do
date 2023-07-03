import './preload.js';
import { LitElement, css } from '../../../vendor/lit/lit-all.min.js';
import { propsToCssVar } from '../lit/style/propsToCssVar.js';

export * from '../../../vendor/lit/lit-all.min.js';
export * from '../../../vendor/@open-wc/lit-helpers/spread.js';

/**
 * @template T
 * @typedef {{
 * 	[K in keyof T]: string extends K
 * 		? never
 * 		: number extends K
 * 		? never
 * 		: symbol extends K
 * 		? never
 * 		: K;
 * } extends { [_ in keyof T]: infer U }
 * 	? U
 * 	: never} KnownKeys
 */

/**
 * @template V
 * @template {string} P
 * @typedef {V extends string ? `${P}${V}` : V} Prefix
 */

/**
 * @template {Record<any, any>} Ctx
 * @typedef {Record<
 * 	string,
 * 	Partial<{ [k in Prefix<KnownKeys<Ctx>, '.'> | KnownKeys<Ctx>]: Ctx[k] }>
 * >} Variants
 */

export class X extends LitElement {
	/** @type {Record<string, Record<any, any>>} */
	static variants = {};

	#cssPropKeys =
		'properties' in this.constructor
			? Object.entries(/** @type {any[]} */ (this.constructor.properties))
					.filter(([, v]) => 'css' in v)
					.map(([k]) => k)
			: [];

	/** @override */
	willUpdate(
		/** @type {import('lit-element').PropertyValues<this>} */ changedProperties,
	) {
		super.willUpdate(changedProperties);

		propsToCssVar(
			this,
			changedProperties.has.bind(changedProperties),
			/** @type {any} */ (this.#cssPropKeys),
		);
	}

	/** @override */
	static styles = [
		css`
			:host {
				display: block;
			}

			/* ————————————————————————————————scrollbars———————————————————————————————— */
			@media screen and (hover: hover) and (pointer: fine) {
				::-webkit-scrollbar {
					width: 12px;
					height: 12px;
				}

				::-webkit-scrollbar-button {
					width: 0;
					height: 0;
				}

				::-webkit-scrollbar-thumb {
					background: var(----colour-background-tertiary);
					border-radius: var(----roundness);

					border: solid 4px var(----colour-background-primary);
				}

				::-webkit-scrollbar-thumb:hover {
					background: var(----colour-text-secondary);
				}

				::-webkit-scrollbar-thumb:active {
					background: var(----colour-accent-primary);
				}

				::-webkit-scrollbar-track {
					background: var(----colour-background-primary);
					border-radius: var(----roundness);
				}

				body::-webkit-scrollbar-track {
					border-radius: 0;
				}

				::-webkit-scrollbar-corner {
					background: transparent;
				}
			}

			/* ————————————————————————————————selection————————————————————————————————— */
			::selection {
				background: var(----colour-accent-secondary);
				color: var(----colour-accent-primary);
			}

			button,
			a {
				-webkit-tap-highlight-color: transparent;
			}

			input {
				color-scheme: dark;
			}

			/* ———————————————————————————————typography————————————————————————————————— */
			h1 {
				color: var(----colour-accent-primary);
				font-family: var(----font-family-display);
				font-weight: 100;

				font-size: 4rem;
				margin-bottom: 0.7em;
				line-height: 0.8;

				letter-spacing: -0.04em;
			}

			h2 {
				color: var(----colour-accent-primary);
				font-family: var(----font-family-display);
				font-weight: 300;

				font-size: 3rem;
				margin-bottom: 0.7em;
				line-height: 0.8;
			}

			h3 {
				color: var(----colour-accent-secondary);
				text-stroke: 0.5px var(----colour-accent-primary);
				-webkit-text-stroke: 0.5px var(----colour-accent-primary);
				font-family: var(----font-family-display);
				font-weight: 300;

				font-size: 2.26rem;
				margin-bottom: 0.7em;
				line-height: 0.8;
			}

			h4 {
				color: var(----colour-text-primary);
				font-family: var(----font-family-display);
				font-weight: 300;

				font-size: 2.26rem;
				margin-bottom: 0.7em;
				line-height: 0.8;
			}

			h5 {
				color: var(----colour-text-primary);
				font-family: var(----font-family-sans);
				font-weight: 700;
				text-transform: uppercase;

				font-size: 1.6rem;
				margin-bottom: 0.7em;
				line-height: 1;
			}

			h6 {
				color: var(----colour-text-primary);
				font-family: var(----font-family-sans);
				font-weight: 500;
				text-transform: uppercase;

				font-size: 1.6rem;
				margin-bottom: 0.7em;
				line-height: 1;
			}

			p,
			input,
			textarea,
			label,
			button {
				color: var(----colour-text-primary);
				font-family: var(----font-family-sans);
			}

			input,
			textarea,
			label,
			button {
				font-size: 1em;
			}

			hr {
				width: 100%;
				border: 0;
				border-top: 1px solid var(----colour-text-primary);
				margin-block-start: 0.5em;
				margin-block-end: 0.5em;
				opacity: 0.3;
			}

			a:any-link {
				font-family: var(----font-family-sans);
				color: var(----colour-accent-primary);
				text-underline-offset: 0.5em;

				transition: opacity 0.2s var(----ease-fast-slow),
					text-underline-offset 0.2s var(----ease-fast-slow);
			}

			a:any-link:hover {
				text-underline-offset: 0.75em;
			}

			a:any-link:active {
				color: var(----colour-accent-secondary);
			}

			x-i {
				font-family: var(----font-family-ic);
				line-height: 1;
				letter-spacing: normal;
				text-transform: none;
				display: inline-block;
				white-space: nowrap;
				word-wrap: normal;
				direction: ltr;
				-webkit-font-feature-settings: 'liga';
				-webkit-font-smoothing: antialiased;
			}
		`,
	];
}
