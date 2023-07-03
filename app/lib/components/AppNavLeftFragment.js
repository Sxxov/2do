import { X, html, spread } from '../../../lib/common/x/X.js';
import { Button } from '../../../lib/components/Button.js';

export class AppNavLeftFragment extends X {
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
		`;
	}
}
customElements.define('x-app-nav-left-fragment', AppNavLeftFragment);
