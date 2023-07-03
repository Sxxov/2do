import { cssT } from '../common/lit/runtime/traits/cssT.js';
import { boolT } from '../common/lit/runtime/types/boolT.js';
import { numT } from '../common/lit/runtime/types/numT.js';
import { strT } from '../common/lit/runtime/types/strT.js';
import { X, css, html, ifDefined, nothing, spread } from '../common/x/X.js';
import { Button } from './Button.js';

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
		checked: boolT,
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
		/** @type {number | undefined} */ this.minlength;
		/** @type {number | undefined} */ this.maxlength;
		/** @type {string | undefined} */ this.pattern;
		/** @type {string} */ this.value = '';
		/**
		 * @type {(typeof this)['type'] extends 'checkbox'
		 * 	? boolean
		 * 	: never}
		 */ this.checked;
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();

		this.#id = `input--${this.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')}`;

		this.#internals.form?.addEventListener('reset', this.#onReset);
		this.#internals.form?.addEventListener('formdata', this.#onFormData);
	}

	/** @override */
	disconnectedCallback() {
		super.disconnectedCallback();

		this.#internals.form?.removeEventListener('reset', this.#onReset);
		this.#internals.form?.removeEventListener('formdata', this.#onFormData);
	}

	#onReset = () => {
		this.value = '';
	};

	#onFormData = (/** @type {FormDataEvent} */ e) => {
		if (this.type === 'checkbox')
			e.formData.set(this.name, this.checked ? 'on' : '');
		else e.formData.set(this.name, this.value);
	};

	/** @override */
	render() {
		return html`
			<input
				class="${this.label ? 'labelled' : ''} ${this.type ===
				'checkbox'
					? 'checkbox'
					: ''}"
				id="${this.#id}"
				form="${this.#internals.form?.id ?? ''}"
				type="${this.type}"
				placeholder="${this.placeholder}"
				autocomplete="${/** @type {any} */ (this.autocomplete)}"
				?required="${this.required}"
				minlength="${ifDefined(this.minlength)}"
				maxlength="${ifDefined(this.maxlength)}"
				pattern="${ifDefined(this.pattern)}"
				name="${this.name}"
				.value="${this.type === 'checkbox' ? nothing : this.value}"
				.checked="${ifDefined(this.checked)}"
				@input="${(/** @type {InputEvent} */ e) => {
					this.value = /** @type {HTMLInputElement} */ (
						e.target
					).value;

					if (this.type === 'checkbox')
						this.checked = /** @type {any} */ (
							/** @type {HTMLInputElement} */ (e.target).checked
						);

					this.dispatchEvent(
						new CustomEvent('input', {
							bubbles: true,
							composed: true,
							detail: e,
						}),
					);
				}}"
				@change="${(/** @type {InputEvent} */ e) => {
					this.value = /** @type {HTMLInputElement} */ (
						e.target
					).value;

					if (this.type === 'checkbox')
						this.checked = /** @type {any} */ (
							/** @type {HTMLInputElement} */ (e.target).checked
						);

					this.dispatchEvent(
						new CustomEvent('change', {
							bubbles: true,
							composed: true,
							detail: e,
						}),
					);
				}}"
				@focus="${(
					/**
					 * @type {FocusEvent & {
					 * 	currentTarget: HTMLInputElement;
					 * }}
					 */ e,
				) => {
					if (
						this.type === 'date' ||
						this.type === 'time' ||
						this.type === 'datetime-local'
					)
						e.currentTarget.showPicker();
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
			${this.type === 'checkbox'
				? html`
						<div
							class="toggle"
							style="
								--top-input: ${this.label ? 42 : 0}px;
								--height-input: ${this.height || (this.label ? '112px' : '56px')};
							"
						>
							<div
								class="content"
								@click="${() => {
									this.checked = /** @type {any} */ (
										!this.checked
									);

									this.dispatchEvent(
										new CustomEvent('change', {
											bubbles: true,
											composed: true,
										}),
									);

									this.dispatchEvent(
										new CustomEvent('input', {
											bubbles: true,
											composed: true,
										}),
									);
								}}"
							>
								<div class="track">
									<div class="knob">
										<x-button
											${spread(Button.variants.shadowSm)}
											${spread(Button.variants.secondary)}
											height="100%"
											width="100%"
											padding="7px"
											><x-i
												style="color: ${this.checked
													? 'var(----colour-accent-primary)'
													: 'var(----colour-text-secondary)'}"
												>${this.checked
													? 'check'
													: 'close'}</x-i
											></x-button
										>
									</div>
								</div>
							</div>
						</div>
				  `
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
			input:not([type='checkbox']):not(:placeholder-shown) ~ label,
			input[type='checkbox']:checked ~ label {
				color: var(--colour-label-valued);
			}

			input,
			.toggle {
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

			input.checkbox {
				display: none;
			}

			input:focus {
				outline: 0;

				background: var(--colour-background-focus);
				box-shadow: var(----shadow-inner-sm), var(----shadow-md);
			}

			.toggle > .content {
				--width-knob: 35px;
				--height-knob: 35px;
				--width-track: 56px;
				--height-track: 35px;

				height: 100%;

				display: flex;
				align-items: center;

				padding-bottom: 7px;
				box-sizing: border-box;
			}

			.toggle > .content > .track {
				display: grid;
				align-items: center;

				width: var(--width-track);
				height: var(--height-track);

				background: var(----colour-background-primary);
				border-radius: var(----roundness);

				transition: background 0.2s var(----ease-slow-slow);
			}

			.toggle > .content > .track > .knob {
				width: var(--width-knob);
				height: var(--height-knob);

				padding: 2px;
				box-sizing: border-box;

				transition: transform 0.2s var(----ease-fast-slow);
			}

			input:checked ~ .toggle > .content > .track {
				background: var(--colour-label-valued);
			}

			input:checked ~ .toggle > .content > .track > .knob {
				transform: translateX(
					calc(var(--width-track) - var(--width-knob))
				);
			}
		`,
	];
}
customElements.define('x-input', Input);
