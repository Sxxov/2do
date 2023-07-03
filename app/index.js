import { stateT } from '../lib/common/lit/runtime/traits/stateT.js';
import { arrT } from '../lib/common/lit/runtime/types/arrT.js';
import { boolT } from '../lib/common/lit/runtime/types/boolT.js';
import { numT } from '../lib/common/lit/runtime/types/numT.js';
import { objT } from '../lib/common/lit/runtime/types/objT.js';
import { strT } from '../lib/common/lit/runtime/types/strT.js';
import { X, css, html, repeat, spread, until } from '../lib/common/x/X.js';
import { Button } from '../lib/components/Button.js';
import '../lib/components/Dialog.js';
import '../lib/components/Input.js';
import '../lib/components/LoaderCircle.js';
import '../lib/components/LoaderSkeleton.js';
import { Toast } from '../lib/components/Toast.js';
import { Toaster } from '../lib/components/Toaster.js';
import '../lib/layout/Main.js';
import './lib/components/AppNavRightFragment.js';
import './lib/components/AppNavMenuFragment.js';
import './lib/components/NoteItem.js';
import '../lib/components/Dropdown.js';
import { AuthManager } from './lib/core/AuthManager.js';
import {
	NoteManager,
	NoteSortKinds,
	NoteSorters,
} from './lib/core/NoteManager.js';
import './lib/components/AppNavRightFragment.js';
import './lib/components/AppNavMenuFragment.js';
import './lib/components/AppNavLeftFragment.js';

export class AppRoute extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		notes: arrT(stateT),
		notePlaceholders: arrT(stateT),
		notesPromise: objT(stateT),
		noteSortOrder: numT(stateT),
		noteSortKind: strT(stateT),
		noteSearchQuery: strT(stateT),
		noteDialogOpen: boolT(stateT),
		noteDialogNote: objT(stateT),

		user: objT(stateT),
	};

	constructor() {
		super();

		/** @type {import('./lib/core/NoteManager.js').Note[] | undefined} */ this
			.notes;
		/** @type {{ title: string; description: string }[]} */ this.notePlaceholders =
			[];
		/** @type {Promise<import('./lib/core/NoteManager.js').Note[]>} */ this
			.notesPromise;
		/** @type {1 | -1} */ this.noteSortOrder = -1;
		/** @type {import('./lib/core/NoteManager.js').NoteSortKind} */ this.noteSortKind =
			NoteSortKinds.DATE_MODIFIED;
		/** @type {string} */ this.noteSearchQuery = '';
		/** @type {boolean} */ this.noteDialogOpen = false;
		/** @type {import('./lib/core/NoteManager.js').Note | undefined} */ this
			.noteDialogNote;

		/**
		 * @type {| import('./lib/core/NoteManager.js').Note['owner']
		 * 	| undefined}
		 */ this.user;
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();

		this.#refreshNotes();
	}

	/** @override */
	disconnectedCallback() {
		super.disconnectedCallback();
	}

	/** @returns {Promise<import('./lib/core/NoteManager.js').Note[]>} */
	async #getNotes() {
		const [res, err] = await NoteManager.instance.getAll();

		if (err)
			for (const e of err) Toaster.toast(e.message, Toast.variants.error);

		if (res) return res;

		return [];
	}

	async #refreshNotes(clear = false) {
		if (clear) this.notes = undefined;
		this.notesPromise = this.#getNotes();
		this.notes = await this.notesPromise;
		this.notePlaceholders = [];
	}

	async #refreshAndToastNotes() {
		const { cancel } = Toaster.toast('Refreshing notes…');

		await this.#refreshNotes(true);

		cancel();

		Toaster.toast('Notes refreshed', Toast.variants.ok);
	}

	async #createNoteAndToast(
		/** @type {string} */ title,
		/** @type {string} */ description,
	) {
		this.notePlaceholders.push({
			title,
			description,
		});
		this.requestUpdate('notePlaceholders');

		const [, err] = await NoteManager.instance.create({
			title,
			description,
		});
		if (err)
			for (const e of err) Toaster.toast(e.message, Toast.variants.error);
		else Toaster.toast('Successfully created note', Toast.variants.ok);

		await this.#refreshNotes();
	}

	async #toggleDoneNoteAndToast(
		/** @type {import('./lib/core/NoteManager.js').Note} */ note,
		/** @type {boolean} */ done = !note.done,
	) {
		note.done = done;

		Object.assign(
			note,
			NoteManager.instance.edit(note, {
				done,
			}),
		);
		this.requestUpdate('notes');

		const [, err] = await NoteManager.instance.propagate(note);
		if (err)
			for (const e of err) Toaster.toast(e.message, Toast.variants.error);

		this.#refreshNotes();
	}

	async #editNoteAndToast(
		/** @type {import('./lib/core/NoteManager.js').Note} */ note,
		/**
		 * @type {Partial<{
		 * 	title: string;
		 * 	description: string;
		 * 	done: boolean;
		 * 	priority: import('./lib/core/NoteManager.js').NotePriority;
		 * }>}
		 */ to,
	) {
		const { cancel } = Toaster.toast('Updating note…');

		Object.assign(note, NoteManager.instance.edit(note, to));
		this.requestUpdate('notes');
		const [, err] = await NoteManager.instance.propagate(note);

		cancel();

		if (err)
			for (const e of err) Toaster.toast(e.message, Toast.variants.error);
		else Toaster.toast('Successfully updated note', Toast.variants.ok);

		this.#refreshNotes();
	}

	async #deleteNoteAndToast(
		/** @type {import('./lib/core/NoteManager.js').Note} */ note,
	) {
		const { cancel } = Toaster.toast('Deleting note…');

		this.notes?.splice(this.notes.indexOf(note), 1);
		this.requestUpdate('notes');

		const [, err] = await NoteManager.instance.delete(note);

		cancel();

		if (err)
			for (const e of err) Toaster.toast(e.message, Toast.variants.error);
		else Toaster.toast('Note deleted', Toast.variants.ok);
	}

	#getSortedAndFilteredNotes(
		/** @type {import('./lib/core/NoteManager.js').Note[]} */ notes,
	) {
		return notes
			.filter(
				(v) =>
					this.noteSearchQuery === '' ||
					v.title
						.toLowerCase()
						.includes(this.noteSearchQuery.toLowerCase()) ||
					v.description
						.toLowerCase()
						.includes(this.noteSearchQuery.toLowerCase()),
			)
			.sort(
				(a, b) =>
					NoteSorters[this.noteSortKind](a, b) * this.noteSortOrder,
			);
	}

	/** @override */
	render() {
		return html`
			<x-main>
				<x-app-nav-menu-fragment
					slot="nav-menu"
				></x-app-nav-menu-fragment>
				<x-app-nav-left-fragment
					slot="nav-left"
				></x-app-nav-left-fragment>
				<x-app-nav-right-fragment
					slot="nav-right"
					@refresh=${() => {
						void this.#refreshAndToastNotes();
					}}
				></x-app-nav-right-fragment>
				<div class="content">
					<div class="heading">
						${until(
							AuthManager.instance
								.getUser()
								.then(
									(res) => html`<h5>
										${new Date().getHours() < 4
											? 'Late nights'
											: new Date().getHours() < 12
											? 'Good morning'
											: new Date().getHours() < 18
											? 'Good afternoon'
											: new Date().getHours() < 22
											? 'Good evening'
											: 'Good night'},
										${res[0]?.data.username ?? 'User'}.
									</h5>`,
								),
							html`<x-loader-circle
								height="1.6rem"
								width="1.6rem"
							></x-loader-circle>`,
						)}
						${until(
							this.notesPromise.then((notes) => {
								const count = notes.filter(
									({ done }) => !done,
								).length;

								return html`<p>
									${count} thing${count === 1 ? '' : 's'} left
									to do
								</p>`;
							}),
							html`<x-loader-circle
								height="20.67px"
								width="20.67px"
							></x-loader-circle>`,
						)}
					</div>

					<div class="notes">
						<div class="toolbar">
							<div class="search">
								<x-input
									placeholder="Search"
									@input=${(
										/**
										 * @type {InputEvent & {
										 * 	currentTarget: HTMLInputElement;
										 * }}
										 */ e,
									) => {
										this.noteSearchQuery =
											e.currentTarget.value;
									}}
								></x-input>
								<div class="sort">
									<x-dropdown
										width="100%"
										.expanderVariant=${{
											...Button.variants.flatRight,
											...Button.variants.shadowSm,
										}}
										.items=${[
											{
												icon: 'today',
												title: 'Modified',
												value: NoteSortKinds.DATE_MODIFIED,
												selected: true,
											},
											{
												icon: 'today',
												title: 'Created',
												value: NoteSortKinds.DATE_CREATED,
											},
											{
												icon: 'sort_by_alpha',
												title: 'Alphabetical',
												value: NoteSortKinds.ALPHANUMERIC,
											},
										]}
										@change=${(
											/** @type {CustomEvent} */ e,
										) => {
											this.noteSortKind = e.detail.value;
										}}
									>
									</x-dropdown>
									<x-button
										${spread(Button.variants.secondary)}
										${spread(Button.variants.flatLeft)}
										${spread(Button.variants.shadowSm)}
										@click=${() => {
											this.noteSortOrder *= -1;
										}}
										><x-i
											>${this.noteSortOrder > 0
												? 'arrow_downward'
												: 'arrow_upward'}</x-i
										></x-button
									>
								</div>
							</div>
						</div>

						<div class="new">
							<x-button
								width="100%"
								${spread(Button.variants.primary)}
								${spread(Button.variants.shadowSm)}
								@click=${() => {
									this.noteDialogOpen = true;
								}}
								><x-i slot="left">sticky_note_2</x-i>Add a
								note<x-i slot="right">add</x-i></x-button
							>
						</div>
						${this.notePlaceholders.map(
							(note) => html`
								<x-note-item
									title=${note.title}
									description=${note.description}
									placeholder
								></x-note-item>
							`,
						)}
						${this.notes
							? this.notes.length > 0
								? repeat(
										this.#getSortedAndFilteredNotes(
											this.notes,
										),
										(note) => note.id,
										(note) => html`
											<x-note-item
												.title=${note.title}
												.description=${note.description}
												.done=${note.done}
												@delete=${() => {
													void this.#deleteNoteAndToast(
														note,
													);
												}}
												@edit=${() => {
													this.noteDialogNote = note;
													this.noteDialogOpen = true;
												}}
												@done=${() => {
													void this.#toggleDoneNoteAndToast(
														note,
													);
												}}
											></x-note-item>
										`,
								  )
								: this.notePlaceholders.length <= 0
								? html`<div class="empty">
										<p>
											👌
											<br /><br />
											All done.
										</p>
								  </div>`
								: ''
							: html`<x-loader-skeleton
										height="84px"
									></x-loader-skeleton
									><x-loader-skeleton
										height="56px"
										delay="100ms"
									></x-loader-skeleton
									><x-loader-skeleton
										height="112px"
										delay="200ms"
									></x-loader-skeleton
									><x-loader-skeleton
										height="336px"
										delay="300ms"
									></x-loader-skeleton>`}
						<div class="refresh">
							<x-button
								${spread(Button.variants.secondary)}
								@click=${() => {
									void this.#refreshAndToastNotes();
								}}
							>
								<x-i>refresh</x-i>
							</x-button>
						</div>
					</div>
				</div>
				<x-dialog
					?open=${this.noteDialogOpen}
					icon="note_add"
					title="New note"
					class="note-new"
					@close=${() => {
						this.noteDialogOpen = false;
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

							const form = /** @type {HTMLFormElement} */ (
								e.target
							);
							const formData = new FormData(form);

							let ok = true;

							const title = String(formData.get('title'));
							const description = String(
								formData.get('description'),
							);

							if (!title)
								Toaster.toast(
									'Please enter a title',
									Toast.variants.error,
								),
									(ok = false);

							if (!ok) return;

							this.noteDialogOpen = false;
							form.reset();

							if (this.noteDialogNote) {
								void this.#editNoteAndToast(
									this.noteDialogNote,
									{ title, description },
								);
								this.noteDialogNote = undefined;
							} else
								void this.#createNoteAndToast(
									title,
									description,
								);
						}}
					>
						<x-input
							name="title"
							label="Title"
							value=${this.noteDialogNote?.title ?? ''}
						></x-input>
						<x-input
							name="description"
							label="Description"
							value=${this.noteDialogNote?.description ?? ''}
						>
						</x-input>
					</form>
					<x-button
						type="submit"
						form="note-new"
						width="100%"
						slot="buttons"
					>
						<x-i slot="left"
							>${this.noteDialogNote ? 'save' : 'done'}</x-i
						>
						${this.noteDialogNote ? 'Save' : 'Create'}
						<x-i slot="right">_</x-i>
					</x-button>
				</x-dialog>
			</x-main>
		`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			.content {
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 56px;
			}

			.content > .heading {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 14px;
				padding-top: 56px;
			}

			.content > .heading > h5 {
				margin: 0;
			}

			.content > .heading > p {
				margin: 0;
			}

			.content > .notes {
				display: flex;
				flex-direction: column;
				gap: 14px;
				max-width: 600px;
				width: 100%;
			}

			.content > .notes > .toolbar {
				position: sticky;
				top: 98px;
				height: 84px;

				display: flex;
				gap: 14px;

				z-index: 1;
			}

			.content > .notes > .toolbar > .search {
				display: flex;
				gap: 14px;

				margin: 0 -14px;
				width: calc(100% + 28px);

				background: var(----colour-background-primary);
				box-shadow: var(----shadow-inner-sm), var(----shadow-sm);
				border-radius: 56px;
				padding: 14px;
				box-sizing: border-box;
			}

			.content > .notes > .toolbar > .search > .sort {
				display: flex;
			}

			.content > .notes > .toolbar > .actions {
				display: flex;
				gap: 14px;
				align-items: center;
			}

			.content > .notes > .empty {
				display: flex;
				align-items: center;
				justify-content: center;
				text-align: center;
				color: var(----colour-text-secondary);
				background: var(----colour-background-primary);
				box-shadow: var(----shadow-inner-sm), var(----shadow-sm);
				border-radius: 28px;
				padding: 14px;
				box-sizing: border-box;
				margin: 0;
				height: 336px;
			}

			.content > .notes > .refresh {
				display: flex;
				flex-direction: column;
				align-items: center;

				width: 100%;
			}

			x-dialog.note-new > form {
				display: flex;
				flex-direction: column;
				gap: 14px;
			}
		`,
	];
}
customElements.define('x-index', AppRoute);
