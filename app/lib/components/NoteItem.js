import { boolT } from '../../../lib/common/lit/runtime/types/boolT.js';
import { numT } from '../../../lib/common/lit/runtime/types/numT.js';
import { objT } from '../../../lib/common/lit/runtime/types/objT.js';
import { strT } from '../../../lib/common/lit/runtime/types/strT.js';
import { X, html, css, spread, nothing } from '../../../lib/common/x/X.js';
import { Button } from '../../../lib/components/Button.js';
import { NotePriorities } from '../core/NoteManager.js';

export class NoteItem extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		title: strT,
		description: strT,
		done: boolT,
		priority: numT,
		date: objT,
		placeholder: boolT,
	};

	constructor() {
		super();

		/** @type {string} */ this.title;
		/** @type {string} */ this.description;
		/** @type {import('../core/NoteManager.js').NotePriority} */ this
			.priority;
		/** @type {Date} */ this.date;
		/** @type {boolean} */ this.done;
		/** @type {boolean} */ this.placeholder;
	}

	/** @override */
	render() {
		return html`
			<x-button
				${spread(
					this.done
						? Button.variants.transparent
						: Button.variants.secondary,
				)}
				${spread(Button.variants.shadowSm)}
				${spread(this.placeholder ? {} : Button.variants.flatRight)}
				width="100%"
				height="${this.priority === NotePriorities.NORMAL
					? 'auto'
					: this.priority === NotePriorities.IMPORTANT
					? '112px'
					: this.priority === NotePriorities.URGENT
					? '224px'
					: 'auto'}"
				?disabled=${this.placeholder}
				@click=${() => {
					if (this.placeholder) return;

					this.dispatchEvent(
						new CustomEvent('edit', {
							bubbles: true,
							composed: true,
						}),
					);
				}}
			>
				<div class="content" slot="content">
					<div class="info">
						<p class="title">
							${this.title}<span class="meta"
								>${this.date?.toLocaleString(undefined, {
									weekday: 'short',
									month: 'short',
									day: 'numeric',
								}) ?? nothing}</span
							>
						</p>
						${this.description
							? html`<p class="description">
									${this.description}
							  </p>`
							: ''}
					</div>
				</div>
			</x-button>
			${this.placeholder
				? ''
				: html`<div class="actions">
							<!-- <x-button
					${spread(Button.variants.secondary)}
					${spread(Button.variants.shadowSm)}
					${spread(Button.variants.flat)}
					roundness="28px"
					height="100%"
					><x-i>edit</x-i></x-button
				> -->
							<x-button
								${spread(
									this.done
										? Button.variants.transparent
										: Button.variants.secondary,
								)}
								${spread(Button.variants.shadowSm)}
								${spread(Button.variants.flatLeft)}
								roundness="28px"
								height="100%"
								@click=${() => {
									this.dispatchEvent(
										new CustomEvent('done', {
											bubbles: true,
											composed: true,
										}),
									);
								}}
								><x-i
									>${this.done
										? 'check_circle'
										: 'radio_button_unchecked'}</x-i
								></x-button
							>
						</div>
						<div class="aux">
							<x-button
								${spread(Button.variants.transparent)}
								${spread(Button.variants.shadowNone)}
								roundness="28px"
								padding="16px"
								height="100%"
								@click=${() => {
									this.dispatchEvent(
										new CustomEvent('delete', {
											bubbles: true,
											composed: true,
										}),
									);
								}}
								><x-i>delete_outline</x-i></x-button
							>
						</div>`}
		`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			:host {
				position: relative;
				display: flex;
				gap: 2px;
			}

			.content {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				gap: 0.5rem;
			}

			.content > .info {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: center;
				width: 100%;
				gap: 0.5rem;
			}

			.content > .info > .title {
				margin: 0;
				font-weight: bold;

				word-break: break-word;
				text-align: left;
			}

			.content > .info > .title > .meta {
				margin: 0;
				font-weight: 100;
				font-size: 0.8rem;
				color: var(----colour-text-secondary);
				margin-left: 0.5rem;
			}

			.content > .info > .title > .meta::before {
				content: '·';
				margin-right: 0.5rem;
			}

			.content > .info > .description {
				margin: 0;
				color: var(----colour-text-secondary);
			}

			.actions {
				display: flex;
				gap: 2px;
			}

			.aux {
				display: flex;
				gap: 2px;
				position: absolute;
				left: calc(100%);
				top: 50%;
				transform: translateY(-50%);

				opacity: 0;

				transition: opacity 0.2s var(----ease-fast-slow);
			}

			:host:hover .aux,
			*:hover ~ .aux,
			.aux:hover {
				opacity: 1;
			}
		`,
	];
}
customElements.define('x-note-item', NoteItem);
