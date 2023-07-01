import { X, html, css, spread } from '../../../lib/common/x/X.js';
import { Button } from '../../../lib/components/Button.js';

export class AppCtaFragment extends X {
	/** @override */
	render() {
		return html`
			<x-button
				${spread(Button.variants.secondary)}
				@click=${(/** @type {PointerEvent} */ e) => {
					e.currentTarget?.dispatchEvent(
						new CustomEvent('refresh', {
							bubbles: true,
							composed: true,
						}),
					);
				}}
			>
				<x-i>refresh</x-i>
			</x-button>
			<!-- <x-button ${spread(Button.variants.primary)}>
				<x-i slot="left">add</x-i>
				Note
			</x-button> -->
		`;
	}
}
customElements.define('x-app-cta-fragment', AppCtaFragment);
