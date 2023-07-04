import { convertDateToSqlDatetime } from '../../../lib/common/convert/convertDateToSqlDatetime.js';
import { stateT } from '../../../lib/common/lit/runtime/traits/stateT.js';
import { boolT } from '../../../lib/common/lit/runtime/types/boolT.js';
import { objT } from '../../../lib/common/lit/runtime/types/objT.js';
import { X, html, css, nothing, spread } from '../../../lib/common/x/X.js';
import { Button } from '../../../lib/components/Button.js';
import { Input } from '../../../lib/components/Input.js';
import { Toast } from '../../../lib/components/Toast.js';
import { Toaster } from '../../../lib/components/Toaster.js';
import { NoteManager, NotePriorities } from '../core/NoteManager.js';
import '../../../lib/components/Dialog.js';
import '../../../lib/components/Dropdown.js';

export class NoteDialog extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		open: boolT,
		note: objT,

		noteCache: objT(stateT),
	};

	constructor() {
		super();

		/** @type {boolean} */ this.open = false;
		/** @type {import('../core/NoteManager.js').Note | undefined} */ this
			.note;
	}

	async #createNoteAndToast(
		/**
		 * @type {Pick<
		 * 	import('../../lib/core/NoteManager.js').Note,
		 * 	'title' | 'description' | 'dateStart' | 'dateDue' | 'priority'
		 * >}
		 */ { title, description, dateStart, dateDue, priority },
	) {
		this.dispatchEvent(
			new CustomEvent('create', {
				bubbles: true,
				composed: true,
				detail: {
					note: {
						title,
						description,
						dateStart,
						dateDue,
						priority,
					},
				},
			}),
		);

		const [, err] = await NoteManager.instance.create({
			title,
			description,
			dateStart,
			dateDue,
			priority,
		});

		if (err)
			for (const e of err) Toaster.toast(e.message, Toast.variants.error);
		else Toaster.toast('Successfully created note', Toast.variants.ok);

		this.dispatchEvent(
			new CustomEvent('refresh', {
				bubbles: true,
				composed: true,
			}),
		);
	}

	async #editNoteAndToast(
		/** @type {import('../../lib/core/NoteManager.js').Note} */ note,
		/**
		 * @type {Partial<
		 * 	Pick<
		 * 		import('../../lib/core/NoteManager.js').Note,
		 * 		| 'title'
		 * 		| 'done'
		 * 		| 'description'
		 * 		| 'priority'
		 * 		| 'dateStart'
		 * 		| 'dateDue'
		 * 	>
		 * >}
		 */ to,
	) {
		const { cancel } = Toaster.toast('Updating note…');

		Object.assign(note, NoteManager.instance.edit(note, to));

		this.dispatchEvent(
			new CustomEvent('edit', {
				bubbles: true,
				composed: true,
				detail: {
					note,
				},
			}),
		);

		const [, err] = await NoteManager.instance.propagate(note);

		cancel();

		if (err)
			for (const e of err) Toaster.toast(e.message, Toast.variants.error);
		else Toaster.toast('Successfully updated note', Toast.variants.ok);

		this.dispatchEvent(
			new CustomEvent('refresh', {
				bubbles: true,
				composed: true,
			}),
		);
	}

	async #deleteNoteAndToast(
		/** @type {import('../core/NoteManager.js').Note} */ note,
	) {
		const { cancel } = Toaster.toast('Deleting note…');

		this.dispatchEvent(
			new CustomEvent('delete', {
				bubbles: true,
				composed: true,
				detail: {
					note: this.note,
				},
			}),
		);

		const [, err] = await NoteManager.instance.delete(note);

		cancel();

		if (err)
			for (const e of err) Toaster.toast(e.message, Toast.variants.error);
		else Toaster.toast('Note deleted', Toast.variants.ok);

		this.dispatchEvent(
			new CustomEvent('refresh', {
				bubbles: true,
				composed: true,
			}),
		);
	}

	/** @override */
	willUpdate(
		/** @type {import('lit-element').PropertyValues<this>} */ changed,
	) {
		super.willUpdate?.(changed);

		/** @type {Partial<import('../core/NoteManager.js').Note>} */ this.noteCache =
			{
				title: '',
				description: '',
				dateStart: new Date(),
				dateDue: new Date(),
				...this.note,
			};
	}

	/** @override */
	render() {
		console.log('NoteDialog#render');

		return html`
			<x-dialog
				?open=${this.open}
				icon="note_add"
				title=${this.note ? 'Edit note' : 'New note'}
				class="note-new"
				@close=${() => {
					this.open = false;
					this.dispatchEvent(
						new CustomEvent('close', {
							bubbles: true,
							composed: true,
						}),
					);
				}}
			>
				<form
					id="note-new"
					@keydown="${(/** @type {KeyboardEvent} */ e) => {
						if (e.key === 'Enter') {
							// blur focus from input to emit `change` event
							/** @type {HTMLElement} */ (e.target)?.blur?.();

							e.preventDefault();
							e.stopPropagation();
							/** @type {HTMLFormElement} */ (
								e.currentTarget
							).dispatchEvent(
								new SubmitEvent('submit', {
									cancelable: true,
									composed: true,
									bubbles: true,
								}),
							);
						}
					}}"
					@submit=${(/** @type {SubmitEvent} */ e) => {
						e.preventDefault();

						const form = /** @type {HTMLFormElement} */ (e.target);
						const formData = new FormData(form);

						let ok = true;

						const title = String(formData.get('title'));
						const description = String(formData.get('description'));
						const dateStart = new Date(
							Number(
								new Date(String(formData.get('date-start'))),
							) -
								new Date().getTimezoneOffset() * 60 * 1000,
						);
						const dateDue = formData.get('all-day')
							? new Date(0)
							: new Date(
									Number(
										new Date(
											String(formData.get('date-due')),
										),
									) -
										new Date().getTimezoneOffset() *
											60 *
											1000,
							  );
						const priority =
							formData.get('priority') === 'priority-important'
								? NotePriorities.IMPORTANT
								: formData.get('priority') === 'priority-urgent'
								? NotePriorities.URGENT
								: NotePriorities.NORMAL;
						if (!title)
							Toaster.toast(
								'Please enter a title',
								Toast.variants.error,
							),
								(ok = false);

						if (!ok) return;

						if (this.note) {
							void this.#editNoteAndToast(this.note, {
								title,
								description,
								dateStart,
								dateDue,
								priority,
							});
						} else
							void this.#createNoteAndToast({
								title,
								description,
								dateStart,
								dateDue,
								priority,
							});

						this.open = false;
						this.dispatchEvent(
							new CustomEvent('close', {
								bubbles: true,
								composed: true,
							}),
						);
					}}
				>
					<x-input
						name="title"
						label="Title"
						.value=${this.noteCache?.title ?? ''}
					></x-input>
					<x-input
						name="description"
						label="Description"
						.value=${this.noteCache?.description ?? ''}
					>
					</x-input>
					<x-input
						name="date-start"
						label="Start date"
						type="datetime-local"
						.value=${convertDateToSqlDatetime(
							this.noteCache?.dateStart ?? new Date(),
						)}
					></x-input>
					<div class="due">
						${(this.noteCache?.dateDue?.getUTCFullYear() ?? 1970) <=
						1970
							? nothing
							: html`
									<x-input
										name="date-due"
										label="Due date"
										type="datetime-local"
										value=${convertDateToSqlDatetime(
											this.noteCache?.dateDue ??
												new Date(),
										)}
									></x-input>
							  `}
						<x-input
							name="all-day"
							label="All day"
							type="checkbox"
							.checked=${(this.noteCache?.dateDue?.getUTCFullYear() ??
								1970) <= 1970}
							@change=${(
								/**
								 * @type {CustomEvent & {
								 * 	currentTarget: Input;
								 * }}
								 */ e,
							) => {
								if (!this.noteCache) return;

								if (e.currentTarget.checked)
									this.noteCache.dateDue = new Date(0);
								else
									this.noteCache.dateDue =
										this.noteCache.dateStart ?? new Date();

								this.requestUpdate('noteCache');
							}}
						></x-input>
					</div>
					<x-dropdown
						name="priority"
						width="100%"
						i=${this.noteCache?.priority ?? 0}
						.expanderVariant=${{
							...Button.variants.shadowSm,
						}}
						.items=${[
							{
								icon: 'info',
								title: 'Normal',
								value: 'priority-normal',
								selected: true,
							},
							{
								icon: 'warning',
								title: 'Important',
								value: 'priority-important',
							},
							{
								icon: 'priority_high',
								title: 'URGENT',
								value: 'priority-urgent',
							},
						]}
					>
					</x-dropdown>
				</form>
				<div class="buttons" slot="buttons">
					<x-button type="submit" form="note-new" width="100%">
						<x-i slot="left">${this.note ? 'save' : 'done'}</x-i>
						${this.note ? 'Save' : 'Create'}
						<x-i slot="right">_</x-i>
					</x-button>
					${this.note
						? html`<x-button
								${spread(Button.variants.secondary)}
								@click=${() => {
									if (!this.note) return;

									this.open = false;
									this.dispatchEvent(
										new CustomEvent('close', {
											bubbles: true,
											composed: true,
										}),
									);
									this.#deleteNoteAndToast(this.note);
								}}
						  >
								<x-i slot="left">delete</x-i>
								Delete
								<x-i slot="right"></x-i>
						  </x-button>`
						: nothing}
				</div>
			</x-dialog>
		`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			x-dialog.note-new > form {
				display: flex;
				flex-direction: column;
				gap: 14px;
			}

			x-dialog.note-new > form > .due {
				display: flex;
				gap: 14px;
			}

			x-dialog.note-new > form > .due > x-input:checked ~ x-input {
				display: none;
			}

			x-dialog.note-new > .buttons {
				display: flex;
				gap: 14px;

				width: 100%;
			}
		`,
	];
}
customElements.define('x-note-dialog', NoteDialog);
