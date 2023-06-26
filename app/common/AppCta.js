import { X, html, css, spread } from '../../lib/common/x/X.js';
import { Button } from '../../lib/components/Button.js';

export class AppCta extends X {
	/** @override */
	render() {
		return html`
			<x-button ${spread(Button.variants.primary)}>
				<x-i slot="left">add</x-i>
				Note
			</x-button>
		`;
	}
}
customElements.define('x-app-cta', AppCta);
