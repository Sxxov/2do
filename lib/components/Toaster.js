import { arrT } from '../common/lit/runtime/types/arrT.js';
import { X, css, html, spread } from '../common/x/X.js';
import './Button.js';

export class Toaster extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		toasts: arrT,
	};

	/** @type {Toaster | undefined} */
	static instance;

	constructor() {
		super();

		/**
		 * @type {{
		 * 	text: string;
		 * 	spreadable: Record<string, unknown>;
		 * 	timeout: number | undefined;
		 * }[]}
		 */ this.toasts = [];
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();

		if (Toaster.instance)
			console.warn(
				'Multiple Toasters created. This is unsupported & all static methods will point to the first created instance.',
			);
		else Toaster.instance = this;
	}

	/** @override */
	disconnectedCallback() {
		super.disconnectedCallback();

		if (Toaster.instance === this) Toaster.instance = undefined;
	}

	toast(
		/** @type {string} */ text,
		/** @type {Record<string, unknown>} */ spreadable,
		/** @type {number | undefined} */ timeout = undefined,
	) {
		const toast = {
			text,
			spreadable,
			timeout,
		};
		this.toasts.push(toast);
		this.requestUpdate('toasts');

		return {
			cancel: () => {
				this.toasts.splice(this.toasts.indexOf(toast), 1);
				this.requestUpdate('toasts');
			},
		};
	}

	static toast(
		/** @type {string} */ text,
		/** @type {Record<string, unknown>} */ spreadable = {},
		/** @type {number | undefined} */ timeout = undefined,
	) {
		if (!Toaster.instance)
			throw new Error('No Toaster instance found to toast to.');

		return Toaster.instance.toast(text, spreadable, timeout);
	}

	/** @override */
	render() {
		return html`${this.toasts.map(
				(toast) =>
					html`<x-toast
						${spread(toast.spreadable)}
						.timeout=${toast.timeout ?? 3000}
						@dismiss=${() => {
							this.toasts.splice(this.toasts.indexOf(toast), 1);
							this.requestUpdate('toasts');
						}}
						>${toast.text}</x-toast
					>`,
			)}<slot></slot>`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			:host {
				display: block;
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				padding: 14px;
				box-sizing: border-box;

				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: flex-start;
				gap: 14px;

				pointer-events: none;

				z-index: 11;
			}
		`,
	];
}
customElements.define('x-toaster', Toaster);
