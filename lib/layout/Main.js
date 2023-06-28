import { X, css, html, spread } from '../../lib/common/x/X.js';
import '../../lib/components/Toaster.js';
import { Button } from '../../lib/components/Button.js';
import { Tween } from '../common/animation/Tween.js';
import { bezierQuintOut } from '../common/bezier/beziers/bezierQuintOut.js';
import { Cleaner } from '../common/lit/lifecycle/Cleaner.js';
import { boolT } from '../common/lit/runtime/types/boolT.js';
import { stateT } from '../common/lit/runtime/traits/stateT.js';
import { numT } from '../common/lit/runtime/types/numT.js';

export class Main extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		menuActive: boolT(stateT),
		menuProgress: numT(stateT),
	};

	#cleaner = new Cleaner();
	/** @type {Tween} */ #menuTween = new Tween(0, 1, 500, bezierQuintOut);

	constructor() {
		super();

		/** @type {boolean} */ this.menuActive = false;
		/** @type {number} */ this.menuProgress = 0;
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();

		this.#cleaner.add(
			this.#menuTween.subscribe((value) => {
				this.menuProgress = value;
			}),
		);
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
							this.menuActive = !this.menuActive;
							this.#menuTween.play(this.menuActive ? 1 : -2);
						}}
					>
						<x-i slot="content"
							>${this.menuActive ? 'close' : 'menu'}</x-i
						>
					</x-button>
					${this.menuProgress > 0
						? html`<div
								class="menu"
								style="--progress: ${this.menuProgress}"
						  >
								<div
									class="overlay"
									@click=${() => {
										this.menuActive = false;
										this.#menuTween.play(-2);
									}}
								></div>
								<div class="content">
									<slot name="menu"></slot>
								</div>
						  </div>`
						: ''}
				</div>
				<div class="centre">
					<a href="/app"><h1>2do</h1></a>
				</div>
				<div class="right">
					<slot name="cta"></slot>
				</div>
			</nav>
			<div class="root">
				<slot></slot>
				<x-toaster></x-toaster>
			</div>
			<footer>
				<h1>2do</h1>
				<p>&copy; 2023 2do</p>
			</footer>
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
			}

			nav > .left > x-button {
				z-index: 1;
			}

			nav > .left .menu {
				display: contents;
			}

			nav > .left .menu > .content {
				position: absolute;
				top: 84px;
				left: 0;
				width: 400px;
				max-width: 100%;
				height: 100vh;
				background: var(----colour-background-primary);
				border-right: 1px solid var(----colour-background-secondary);

				transform: translateX(calc((1 - var(--progress)) * -100%));
			}

			nav > .left .menu > .content > ::slotted([slot='menu']) {
				display: flex;
				flex-direction: column;
				height: 100%;
				gap: 14px;
				padding: var(----padding);
			}

			nav > .left .menu > .overlay {
				position: absolute;
				top: 84px;
				left: 0;
				width: 100%;
				height: 100vh;
				background: var(----colour-overlay);
				opacity: var(--progress);
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

			nav > .right ::slotted([slot='cta']) {
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
