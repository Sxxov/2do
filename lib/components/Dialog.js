import { cssT } from '../common/lit/runtime/traits/cssT.js';
import { boolT } from '../common/lit/runtime/types/boolT.js';
import { strT } from '../common/lit/runtime/types/strT.js';
import { X, css, html, spread } from '../common/x/X.js';
import { Button } from './Button.js';

export class Dialog extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		width: strT(cssT),
		height: strT(cssT),
		icon: strT,
		title: strT,
		open: boolT,
	};

	constructor() {
		super();

		/** @type {string} */ this.width = 'min(100%, 600px)';
		/** @type {string} */ this.height = 'auto';
		/** @type {string} */ this.icon = 'info';
		/** @type {string} */ this.title = 'Info';
		/** @type {boolean} */ this.open = false;
	}

	close() {
		this.open = false;

		this.dispatchEvent(
			new CustomEvent('close', {
				bubbles: true,
				composed: true,
			}),
		);
	}

	/** @override */
	render() {
		return html`
			<div
				class="overlay ${this.open ? 'open' : ''}"
				@click=${() => this.close()}
				@keydown="${(/** @type {KeyboardEvent} */ e) => {
					if (e.key === 'Escape') {
						this.close();
					}
				}}"
			></div>
			<div class="container ${this.open ? 'open' : ''}">
				<slot name="content">
					<div class="default content">
						<slot name="background">
							<div class="default background"></div>
						</slot>

						<div class="actions">
							<slot name="actions">
								<x-button
									${spread(Button.variants.transparent)}
									${spread(Button.variants.shadowSm)}
									@click=${() => this.close()}
								>
									<x-i>close</x-i>
								</x-button>
							</slot>
						</div>

						<slot name="heading">
							<div class="default heading">
								<x-i>${this.icon}</x-i>
								<h6>${this.title}</h6>
							</div>
						</slot>

						<div class="content">
							<slot></slot>
						</div>

						<div class="buttons">
							<slot name="buttons"></slot>
						</div>
					</div>
				</slot>
			</div>
		`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			:host {
				display: block;

				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;

				display: flex;
				justify-content: center;
				align-items: center;

				z-index: 100;

				pointer-events: none;
			}

			.overlay {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;

				background: var(----colour-overlay);

				opacity: 0;
				pointer-events: none;

				transition: opacity 0.3s var(----ease-fast-slow);

				z-index: -2;
			}

			.overlay.open {
				opacity: 1;

				pointer-events: auto;
			}

			.container {
				position: relative;

				width: var(--width);
				height: var(--height);

				opacity: 0;
				transform: translateY(-20px);
				pointer-events: none;

				max-height: 100%;

				transition: opacity 0.3s var(----ease-fast-slow),
					transform 0.3s var(----ease-fast-slow);
			}

			.container.open {
				opacity: 1;
				transform: translateY(0);

				pointer-events: auto;
			}

			.container .default.content {
				position: relative;

				padding: var(----padding);
				box-sizing: border-box;
			}

			.container .default.content .default.heading {
				display: flex;
				gap: 14px;

				margin-bottom: 28px;
			}

			.container .default.content .default.heading x-i {
				color: var(----colour-accent-primary);
			}

			.container .default.content .default.heading h6 {
				color: var(----colour-accent-primary);
				margin: 0;
				font-size: 1.2rem;
			}

			.container .default.content .default.background {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;

				background: var(----colour-background-primary);
				border-radius: var(----roundness);
				box-shadow: var(----shadow-inner-sm), var(----shadow-md);

				z-index: -1;
			}

			.container .default.content > .actions {
				position: absolute;
				top: 0;
				right: 0;

				display: flex;
				justify-content: flex-end;
				gap: 14px;
			}

			.container .default.content > .buttons {
				display: flex;
				gap: 14px;

				width: 100%;
			}

			.container .default.content > .buttons ::slotted([slot='buttons']) {
				margin-top: 28px;
			}
		`,
	];
}
customElements.define('x-dialog', Dialog);
