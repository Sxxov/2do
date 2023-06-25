import { strT } from '../common/lit/runtime/strT.js';
import { propsToCssVar } from '../common/lit/style/propsToCssVar.js';
import { s } from '../common/store/s.js';
import { X, css, html } from '../common/x/X.js';

export class Input extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		width: strT,
		height: strT,
		colourBackground: strT,
		colourBackgroundHover: strT,
		colourBackgroundFocus: strT,
		colourBackgroundDisabled: strT,
		colourText: strT,
		colourTextHover: strT,
		colourTextFocus: strT,
		colourTextDisabled: strT,
		colourLabel: strT,
		colourLabelValued: strT,
		colourOutline: strT,
		colourOutlineHover: strT,
		colourOutlineFocus: strT,
		colourOutlineDisabled: strT,
		name: strT,
		label: strT,
		placeholder: strT,
		autocomplete: strT,
		type: strT,
	};

	static formAssociated = true;

	#value = s('');

	get value() {
		return this.#value;
	}

	/** @type {string} */ #id = '';

	constructor() {
		super();

		/** @type {string} */ this.width = '100%';
		/** @type {string} */ this.height = '112px';
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
		/** @type {string} */ this.name = '';
		/** @type {string} */ this.label = this.name;
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
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();

		this.#id = `input--${this.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')}`;
	}

	/** @override */
	willUpdate(
		/** @type {import('lit-element').PropertyValues<this>} */ changedProperties,
	) {
		super.willUpdate(changedProperties);

		propsToCssVar(this, changedProperties.has.bind(changedProperties), [
			'width',
			'height',
			'colourBackground',
			'colourBackgroundHover',
			'colourBackgroundFocus',
			'colourBackgroundDisabled',
			'colourText',
			'colourTextHover',
			'colourTextFocus',
			'colourTextDisabled',
			'colourLabel',
			'colourLabelValued',
		]);
	}

	static funnelChildrenValuesInto(
		/** @type {HTMLFormElement} */ form,
		/** @type {FormData} */ into,
	) {
		const inputs =
			/** @type {import('../../lib/components/Input.js').Input[]} */ ([
				...form.querySelectorAll('x-input'),
			]);

		for (const { name, value } of inputs) into.append(name, value.v);
	}

	/** @override */
	render() {
		return html`
			<input
				id="${this.#id}"
				type="${this.type}"
				placeholder="${this.placeholder}"
				autocomplete="${/** @type {any} */ (this.autocomplete)}"
				@change="${(/** @type {InputEvent} */ e) => {
					this.#value.v = /** @type {HTMLInputElement} */ (
						e.target
					).value;
				}}"
			/>
			<label for="${this.#id}">
				<slot name="left"></slot>${this.label}<slot name="right"></slot>
			</label>
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
				height: var(--height);

				color: var(--colour-text);
				font-size: 1em;
				font-family: var(----font-family-sans);

				padding: 0 max(var(----roundness), 7px);
				padding-top: 42px;
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

				background: var(----colour-background-focus);
				box-shadow: var(----shadow-inner-sm), var(----shadow-md);
			}
		`,
	];
}
customElements.define('x-input', Input);
