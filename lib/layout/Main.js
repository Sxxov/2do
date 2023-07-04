import { X, css, html, nothing, spread } from '../../lib/common/x/X.js';
import { Button } from '../../lib/components/Button.js';
import '../../lib/components/Toaster.js';
import { Cleaner } from '../common/lit/lifecycle/Cleaner.js';
import { stateT } from '../common/lit/runtime/traits/stateT.js';
import { boolT } from '../common/lit/runtime/types/boolT.js';

export class Main extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		menuOpen: boolT(stateT),
		defoot: boolT,
	};

	#cleaner = new Cleaner();

	constructor() {
		super();

		/** @type {boolean} */ this.menuOpen = false;
		/** @type {boolean} */ this.defoot = false;
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();

		this.#cleaner.add();
	}

	/** @override */
	disconnectedCallback() {
		super.disconnectedCallback();

		this.#cleaner.flush();
	}

	/** @override */
	render() {
		return html`
			<nav>
				<div class="left">
					<x-button
						width="min-content"
						${spread(Button.variants.secondary)}
						@click=${() => {
							this.menuOpen = !this.menuOpen;
						}}
					>
						<x-i slot="content"
							>${this.menuOpen ? 'close' : 'menu'}</x-i
						>
					</x-button>
					<div class="menu ${this.menuOpen ? 'open' : ''}">
						<div
							class="overlay"
							@click=${() => {
								this.menuOpen = false;
							}}
						></div>
						<div class="content">
							<slot name="nav-menu"></slot>
						</div>
					</div>
					<slot name="nav-left"></slot>
				</div>
				<div class="centre">
					<a href="/app"><h1>2do</h1></a>
				</div>
				<div class="right">
					<slot name="nav-right"></slot>
				</div>
			</nav>
			<div class="root">
				<slot></slot>
				<x-toaster></x-toaster>
			</div>
			${this.defoot
				? nothing
				: html`<footer>
						<h1>2do</h1>
						<p>&copy; 2023 2do</p>
				  </footer>`}
		`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			:host {
				display: block;
				height: 100vh;
				width: 100%;
				overflow: auto;
			}

			nav {
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

			nav > .left {
				grid-area: left;
				justify-self: start;

				display: flex;
				gap: 7px;
			}

			nav > .left ::slotted([slot='nav-left']) {
				display: flex;
				gap: 7px;
			}

			nav > .left > x-button {
				z-index: 1;
			}

			nav > .left .menu {
				display: contents;
			}

			nav > .left .menu > .content {
				position: fixed;
				top: 84px;
				left: 0;
				width: 400px;
				max-width: 100%;
				height: 100vh;
				background: var(----colour-background-primary);
				border-right: 1px solid var(----colour-background-secondary);

				transform: translateX(-100%);
				transition: transform 0.1s var(----ease-slow-fast);
			}

			nav > .left .menu.open > .content {
				transform: translateX(0);
				transition: transform 0.3s var(----ease-fast-slow);
			}

			nav > .left .menu > .content > ::slotted([slot='nav-menu']) {
				display: flex;
				flex-direction: column;
				height: 100%;
				gap: 14px;
				padding: var(----padding);
			}

			nav > .left .menu > .overlay {
				position: fixed;
				top: 84px;
				left: 0;
				width: 100%;
				height: 100vh;
				background: var(----colour-overlay);
				opacity: 0;
				pointer-events: none;

				transition: opacity 0.3s var(----ease-fast-slow);
			}

			nav > .left .menu.open > .overlay {
				opacity: 1;
				pointer-events: auto;
			}

			nav > .centre {
				grid-area: centre;
				justify-self: center;
			}

			nav > .centre > a {
				text-decoration-thickness: 0.05em;
			}

			nav > .centre > a > h1 {
				margin: 0;
				font-size: 2em;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100%;
			}

			nav > .right {
				grid-area: right;
				justify-self: end;
			}

			nav > .right ::slotted([slot='nav-right']) {
				display: flex;
				gap: 7px;
			}

			.root {
				min-height: calc(100% - 84px);
			}

			footer {
				padding: var(----padding);
				box-sizing: border-box;
				border-top: 1px solid var(----colour-background-secondary);
				box-shadow: var(----shadow-sm);
				background: var(----colour-background-primary);
			}
		`,
	];
}
customElements.define('x-main', Main);
