import { cssT } from '../common/lit/runtime/traits/cssT.js';
import { boolT } from '../common/lit/runtime/types/boolT.js';
import { numT } from '../common/lit/runtime/types/numT.js';
import { strT } from '../common/lit/runtime/types/strT.js';
import { X, css, html } from '../common/x/X.js';

export class Input extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		width: strT(cssT),
		height: strT(cssT),
		colourBackground: strT(cssT),
		colourBackgroundHover: strT(cssT),
		colourBackgroundFocus: strT(cssT),
		colourBackgroundDisabled: strT(cssT),
		colourText: strT(cssT),
		colourTextHover: strT(cssT),
		colourTextFocus: strT(cssT),
		colourTextDisabled: strT(cssT),
		colourLabel: strT(cssT),
		colourLabelValued: strT(cssT),
		name: strT,
		label: strT,
		placeholder: strT,
		autocomplete: strT,
		type: strT,
		required: boolT,
		minlength: numT,
		maxlength: numT,
		pattern: strT,
		value: strT,
	};

	static formAssociated = true;

	#internals = this.attachInternals();

	/** @type {string} */ #id = '';

	constructor() {
		super();

		/** @type {string} */ this.name = '';
		/** @type {string} */ this.label = '';
		/** @type {string} */ this.width = '100%';
		/** @type {string} */ this.height = '';
		/** @type {string} */ this.colourBackground =
			'var(----colour-background-secondary)';
		/** @type {string} */ this.colourBackgroundHover =
			'var(----colour-accent-tertiary)';
		/** @type {string} */ this.colourBackgroundFocus =
			'var(----colour-background-primary)';
		/** @type {string} */ this.colourBackgroundDisabled =
			this.colourBackground;
		/** @type {string} */ this.colourText = 'var(----colour-text-primary)';
		/** @type {string} */ this.colourTextHover = this.colourText;
		/** @type {string} */ this.colourTextFocus = this.colourText;
		/** @type {string} */ this.colourTextDisabled =
			'var(----colour-text-secondary)';
		/** @type {string} */ this.colourLabel = 'var(----colour-text-primary)';
		/** @type {string} */ this.colourLabelValued =
			'var(----colour-accent-primary)';
		/** @type {string} */ this.placeholder = ' ';
		/**
		 * @type {| 'on'
		 * 	| 'off'
		 * 	| 'additional-name'
		 * 	| `address-level${1 | 2 | 3 | 4}`
		 * 	| `address-line${1 | 2 | 3}`
		 * 	| 'bday'
		 * 	| 'bday-year'
		 * 	| 'bday-day'
		 * 	| 'bday-month'
		 * 	| 'billing'
		 * 	| 'cc-additional-name'
		 * 	| 'cc-csc'
		 * 	| 'cc-exp'
		 * 	| 'cc-exp-month'
		 * 	| 'cc-exp-year'
		 * 	| 'cc-family-name'
		 * 	| 'cc-given-name'
		 * 	| 'cc-name'
		 * 	| 'cc-number'
		 * 	| 'cc-type'
		 * 	| 'country'
		 * 	| 'country-name'
		 * 	| 'current-password'
		 * 	| 'email'
		 * 	| 'family-name'
		 * 	| 'fax'
		 * 	| 'given-name'
		 * 	| 'home'
		 * 	| 'honorific-prefix'
		 * 	| 'honorific-suffix'
		 * 	| 'impp'
		 * 	| 'language'
		 * 	| 'mobile'
		 * 	| 'name'
		 * 	| 'new-password'
		 * 	| 'nickname'
		 * 	| 'organization'
		 * 	| 'organization-title'
		 * 	| 'pager'
		 * 	| 'photo'
		 * 	| 'postal-code'
		 * 	| 'sex'
		 * 	| 'shipping'
		 * 	| 'street-address'
		 * 	| 'tel-area-code'
		 * 	| 'tel'
		 * 	| 'tel-country-code'
		 * 	| 'tel-extension'
		 * 	| 'tel-local'
		 * 	| 'tel-local-prefix'
		 * 	| 'tel-local-suffix'
		 * 	| 'tel-national'
		 * 	| 'transaction-amount'
		 * 	| 'transaction-currency'
		 * 	| 'url'
		 * 	| 'username'
		 * 	| 'work'
		 * 	| 'one-time-code'
		 * 	| 'current-username'
		 * 	| 'new-username'
		 * 	| 'organization-id'
		 * 	| 'organization-unit-id'
		 * 	| 'country-code'
		 * 	| 'country-name'
		 * 	| 'language'
		 * 	| 'birthday'}
		 */ this.autocomplete = 'off';
		/**
		 * @type {| 'hidden'
		 * 	| 'text'
		 * 	| 'search'
		 * 	| 'tel'
		 * 	| 'url'
		 * 	| 'email'
		 * 	| 'password'
		 * 	| 'datetime'
		 * 	| 'date'
		 * 	| 'month'
		 * 	| 'week'
		 * 	| 'time'
		 * 	| 'datetime-local'
		 * 	| 'number'
		 * 	| 'range'
		 * 	| 'color'
		 * 	| 'checkbox'
		 * 	| 'radio'
		 * 	| 'file'
		 * 	| 'submit'
		 * 	| 'image'
		 * 	| 'reset'
		 * 	| 'button'}
		 */ this.type = 'text';
		/** @type {boolean} */ this.required;
		/** @type {number} */ this.minlength;
		/** @type {number} */ this.maxlength;
		/** @type {string} */ this.pattern;
		/** @type {string} */ this.value = '';
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();

		this.#id = `input--${this.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')}`;
	}

	static funnelChildrenValuesInto(
		/** @type {HTMLFormElement} */ form,
		/** @type {FormData} */ into,
	) {
		const inputs =
			/** @type {import('../../lib/components/Input.js').Input[]} */ ([
				...form.querySelectorAll('x-input'),
			]);

		for (const { name, value } of inputs) into.append(name, value);
	}

	/** @override */
	render() {
		return html`
			<input
				class="${this.label ? 'labelled' : ''}"
				id="${this.#id}"
				form="${this.#internals.form?.id ?? ''}"
				type="${this.type}"
				placeholder="${this.placeholder}"
				autocomplete="${/** @type {any} */ (this.autocomplete)}"
				?required="${this.required}"
				minlength="${this.minlength}"
				maxlength="${this.maxlength}"
				pattern="${this.pattern}"
				.value="${this.value}"
				@input="${(/** @type {InputEvent} */ e) => {
					this.value = /** @type {HTMLInputElement} */ (
						e.target
					).value;
				}}"
				@change="${(/** @type {InputEvent} */ e) => {
					this.value = /** @type {HTMLInputElement} */ (
						e.target
					).value;
				}}"
				style="
					--top-input: ${this.label ? 42 : 0}px;
					--height-input: ${this.height || (this.label ? '112px' : '56px')};
				"
			/>
			${this.label
				? html`<label for="${this.#id}">
						<slot name="label-left"></slot>${this.label}<slot
							name="label-right"
						></slot>
				  </label>`
				: ''}
		`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			:host {
				display: block;
				position: relative;

				width: var(--width);
			}

			label {
				position: absolute;

				display: flex;
				align-items: center;
				justify-content: center;
				gap: 7px;

				top: calc(max(var(----roundness), 7px) - 17.5px);
				left: calc(max(var(----roundness), 7px) - 17.5px);

				color: var(--colour-label);
				font-size: 1em;
				font-family: var(----font-family-sans);

				transition: color 0.2s var(----ease-fast-slow);

				background: var(----colour-background-primary);
				padding: 10.5px 17.5px;
				border-radius: var(----roundness);

				box-shadow: var(----shadow-inner-sm);
			}

			input:-webkit-autofill ~ label,
			input:not(:placeholder-shown) ~ label {
				color: var(--colour-label-valued);
			}

			input {
				display: block;

				width: 100%;
				height: var(--height-input);

				color: var(--colour-text);
				font-size: 1em;
				font-family: var(----font-family-sans);

				padding: 0 max(var(----roundness), 7px);
				padding-top: var(--top-input);
				box-sizing: border-box;

				border-radius: var(----roundness);

				background: var(--colour-background);
				border: 0;

				box-shadow: var(----shadow-inner-none), var(----shadow-sm);

				--transition: background 0.2s var(----ease-fast-slow),
					outline 0.3s var(----ease-slow-slow),
					box-shadow 0.3s var(----ease-fast-slow),
					transform 0.3s var(----ease-fast-slow);

				transition: var(--transition);
			}

			input:focus {
				outline: 0;

				background: var(--colour-background-focus);
				box-shadow: var(----shadow-inner-sm), var(----shadow-md);
			}
		`,
	];
}
customElements.define('x-input', Input);
