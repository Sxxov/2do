import { stateT } from '../../lib/common/lit/runtime/traits/stateT.js';
import { numT } from '../../lib/common/lit/runtime/types/numT.js';
import { objT } from '../../lib/common/lit/runtime/types/objT.js';
import { X, css, html } from '../../lib/common/x/X.js';

export class AppCalendarRoute extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		notes: objT(stateT),
		year: numT(stateT),
		month: numT(stateT),
	};

	constructor() {
		super();
	}

	/** @override */
	render() {
		return html`
			<x-main>
			<x-app-menu-fragment slot="menu"></x-app-menu-fragment>
				<x-app-cta-fragment
					slot="cta"
					@refresh=${() => {
						void this.#refreshAndToastNotes();
					}}
				></x-app-cta-fragment>
				<h1>Calendar</h1>
			</x-main>
		`;
	}

	/** @override */
	static styles = [...super.styles, css``];
}
customElements.define('x-index', AppCalendarRoute);
