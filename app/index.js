import { X, css, html } from '../lib/common/x/X.js';
import '../lib/layout/Main.js';
import './common/AppCta.js';
import './common/AppMenu.js';

export class AppRoute extends X {
	/** @override */
	render() {
		return html`
			<x-main>
				<x-app-menu slot="menu"></x-app-menu>
				<x-app-cta slot="cta"></x-app-cta>
			</x-main>
		`;
	}

	/** @override */
	static styles = [...super.styles, css``];
}
customElements.define('x-index', AppRoute);
