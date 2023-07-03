import { stateT } from '../../lib/common/lit/runtime/traits/stateT.js';
import { numT } from '../../lib/common/lit/runtime/types/numT.js';
import { objT } from '../../lib/common/lit/runtime/types/objT.js';
import { X, css, html, spread } from '../../lib/common/x/X.js';
import { Button } from '../../lib/components/Button.js';
import '../../lib/layout/Main.js';
import '../lib/components/AppNavMenuFragment.js';

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
				<div slot="nav-left">
					<x-button
						${spread(Button.variants.secondary)}
						@click=${() => {
							location.href = '/app';
						}}
					>
						<x-i slot="left">list</x-i>
						List view
					</x-button>
				</div>
				<x-app-nav-menu-fragment
					slot="nav-menu"
				></x-app-nav-menu-fragment>
				<div slot="nav-right"></div>
				<h1>Calendar</h1>
			</x-main>
		`;
	}

	/** @override */
	static styles = [...super.styles, css``];
}
customElements.define('x-index', AppCalendarRoute);
