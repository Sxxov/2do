import { cssT } from '../common/lit/runtime/traits/cssT.js';
import { strT } from '../common/lit/runtime/types/strT.js';
import { X, css, html } from '../common/x/X.js';
import './Button.js';

export class Spacer extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		width: strT(cssT),
		height: strT(cssT),
	};

	constructor() {
		super();

		/** @type {string} */ this.width = '0';
		/** @type {string} */ this.height = '0';
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
			}
		`,
	];
}
customElements.define('x-spacer', Spacer);
