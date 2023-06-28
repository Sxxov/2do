import { Cleaner } from '../common/lit/lifecycle/Cleaner.js';
import { cssT } from '../common/lit/runtime/traits/cssT.js';
import { arrT } from '../common/lit/runtime/types/arrT.js';
import { boolT } from '../common/lit/runtime/types/boolT.js';
import { numT } from '../common/lit/runtime/types/numT.js';
import { objT } from '../common/lit/runtime/types/objT.js';
import { strT } from '../common/lit/runtime/types/strT.js';
import { X, css, html, spread } from '../common/x/X.js';
import { Button } from '../components/Button.js';
import '../components/Spacer.js';

export class Dropdown extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		items: arrT,
		i: numT,
		width: strT(cssT),
		height: strT(cssT),
		expanderVariant: objT,

		expanded: boolT,
	};

	#cleaner = new Cleaner();

	constructor() {
		super();

		/**
		 * @type {{
		 * 	icon: string;
		 * 	title: string;
		 * 	value: string;
		 * }[]}
		 */ this.items = [];
		/** @type {number} */ this.i = 0;
		/** @type {boolean} */ this.expanded = false;
		/** @type {string} */ this.width = '100%';
		/** @type {string} */ this.height = '56px';
		// /** @type {string} */ this.roundnessExpander = 'var(----roundness)';
		// /** @type {string} */ this.paddingExpander =
		// 	'16px max(var(--roundness), 24px)';
		/** @type {import('../common/x/X.js').Variants<Button>} */ this.expanderVariant =
			{};
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();
	}

	/** @override */
	disconnectedCallback() {
		super.disconnectedCallback();

		window.removeEventListener('click', this.#onGlobalClick);

		this.#cleaner.flush();
	}

	#onGlobalClick = () => {
		this.expanded = false;
	};

	/** @override */
	render() {
		const selected = this.items[this.i];

		if (this.expanded)
			window.addEventListener('click', this.#onGlobalClick);
		else window.removeEventListener('click', this.#onGlobalClick);

		return html`
			<div class="expander">
				<slot name="expander">
					<x-button
						${spread(Button.variants.secondary)}
						${spread(this.expanderVariant)}
						width="100%"
						height="56px"
						@click="${(/** @type {MouseEvent} */ e) => {
							e.stopPropagation();
							this.expanded = !this.expanded;
						}}"
						><x-i slot="left">${selected?.icon ?? '_'}</x-i
						><span class="title">${selected?.title ?? ''}</span
						><x-i slot="right"
							>${this.expanded
								? 'expand_less'
								: 'expand_more'}</x-i
						>
					</x-button>
				</slot>
			</div>
			<div class="expandee ${this.expanded ? 'expanded' : ''}">
				<select>
					${this.items.map(
						(v, i) =>
							html`
								<option
									value=${v.value}
									?selected=${this.i === i}
								>
									${v.title}
								</option>
							`,
					)}
				</select>
				<div class="items">
					${this.items.map(
						(v, i) =>
							html`
								<x-button
									${spread(
										this.i === i
											? Button.variants.primary
											: Button.variants.transparent,
									)}
									${spread(Button.variants.shadowNone)}
									width="100%"
									@click=${() => {
										this.expanded = false;
										this.i = i;
										this.requestUpdate('items');
										this.dispatchEvent(
											new CustomEvent('change', {
												detail: v,
											}),
										);
									}}
								>
									<x-i slot="left">${v.icon}</x-i
									><span class="title">${v.title}</span>
								</x-button>
							`,
					)}
				</div>
			</div>
		`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			:host {
				display: block;
				position: relative;
			}

			.expander {
				position: relative;

				width: var(--width);
				height: var(--height);
				z-index: 2;
			}
			.expandee > .items > x-button .title,
			.expander .title {
				display: inline-block;
				width: 100%;
				text-align: left;
			}

			.expandee {
				position: absolute;
				top: 100%;
				left: 0;
				z-index: 1;
				width: 100%;
				min-width: max-content;
				max-height: 400px;
				overflow: visible auto;

				filter: drop-shadow(
					var(----shadow-inner-sm),
					var(----shadow-sm)
				);
			}

			.expandee > .items {
				width: 100%;

				background: var(----colour-background-primary);
				border-radius: var(----roundness);
				/* box-shadow: var(----shadow-inner-sm), var(----shadow-sm); */

				display: flex;
				flex-direction: column;

				opacity: 1;
				transform: translateY(0);

				clip-path: inset(0 0 0 0 round var(----roundness));
				outline: 1px solid var(----colour-background-tertiary);
				outline-offset: -1px;

				pointer-events: auto;

				transition: opacity 0.2s var(----ease-fast-slow),
					clip-path 0.2s var(----ease-fast-slow);
			}

			.expandee:not(.expanded) {
				pointer-events: none;
			}

			.expandee:not(.expanded) > .items {
				opacity: 0;
				/* transform: translateY(-56px); */

				clip-path: inset(0 0 100% 0 round var(----roundness));

				transition: opacity 0.1s 0.1s var(----ease-slow-fast),
					clip-path 0.2s var(----ease-fast-slow);
			}

			.expandee > select {
				display: none;
			}
		`,
	];
}
customElements.define('x-dropdown', Dropdown);
