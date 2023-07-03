import { X, html, spread } from '../../../lib/common/x/X.js';
import { Button } from '../../../lib/components/Button.js';

export class AppNavLeftFragment extends X {
	/** @override */
	render() {
		return html`
			<x-button
				${spread(Button.variants.secondary)}
				@click=${() => {
					location.href = '/app/calendar';
				}}
			>
				<x-i slot="left">today</x-i>
				Calendar view
			</x-button>
		`;
	}
}
customElements.define('x-app-nav-left-fragment', AppNavLeftFragment);
