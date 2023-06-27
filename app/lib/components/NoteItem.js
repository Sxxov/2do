import { objT } from '../../../lib/common/lit/runtime/types/objT.js';
import { strT } from '../../../lib/common/lit/runtime/types/strT.js';
import { X, html, css, spread } from '../../../lib/common/x/X.js';
import { Button } from '../../../lib/components/Button.js';

export class NoteItem extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		title: strT,
		description: strT,
	};

	constructor() {
		super();

		/** @type {string} */ this.title;
		/** @type {string} */ this.description;
	}

	/** @override */
	render() {
		return html`
			<x-button
				${spread(Button.variants.secondary)}
				width="100%"
				height="auto"
			>
				<div class="content" slot="content">
					<p class="title">${this.title}</p>
					<p class="description">${this.description}</p>
				</div>
			</x-button>
		`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			.content {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: center;
				width: 100%;
				gap: 0.5rem;
			}

			.content > .title {
				margin: 0;
				font-weight: bold;
			}

			.content > .description {
				margin: 0;
				color: var(----colour-text-secondary);
			}
		`,
	];
}
customElements.define('x-note-item', NoteItem);
