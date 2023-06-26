import { X, css, html, spread } from '../../lib/common/x/X.js';
import '../../lib/components/Toaster.js';
import { Button } from '../../lib/components/Button.js';

export class Main extends X {
	/** @override */
	render() {
		return html`
			<div class="nav">
				<div class="left">
					<x-button
						width="min-content"
						${spread(Button.variants.secondary)}
					>
						<x-i slot="content">menu</x-i>
					</x-button>
				</div>
				<div class="centre">
					<h1>2do</h1>
				</div>
				<div class="right">
					<x-button ${spread(Button.variants.secondary)}>
						<x-i slot="left">add</x-i>
						New task
					</x-button>
				</div>
			</div>
			<div class="root">
				<slot></slot>
				<x-toaster></x-toaster>
			</div>
		`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			:host {
				display: block;
				height: 100vh;
				width: 100vw;
				overflow: auto;
			}

			.nav {
				position: sticky;
				top: 0;
				left: 0;

				height: 84px;
				padding: 14px;
				box-sizing: border-box;
				border-bottom: 1px solid var(----colour-background-secondary);
				box-shadow: var(----shadow-sm);

				background: var(----colour-background-primary);

				display: grid;
				grid-template-areas: 'left centre right';
				grid-template-columns: 0 1fr 0;

				z-index: 10;
			}

			.nav > .centre > h1 {
				margin: 0;
				font-size: 3em;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100%;
			}
		`,
	];
}
customElements.define('x-main', Main);
