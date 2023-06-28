import { X, css, html, until, spread, repeat } from '../lib/common/x/X.js';
import '../lib/layout/Main.js';
import { Button } from '../lib/components/Button.js';
import './lib/components/AppCtaFragment.js';
import './lib/components/AppMenuFragment.js';
import '../lib/components/LoaderCircle.js';
import '../lib/components/LoaderSkeleton.js';
import './lib/components/NoteItem.js';
import { Dropdown } from '../lib/components/Dropdown.js';
import '../lib/components/Input.js';
import { objT } from '../lib/common/lit/runtime/types/objT.js';
import { stateT } from '../lib/common/lit/runtime/traits/stateT.js';
import { Toaster } from '../lib/components/Toaster.js';
import { Toast } from '../lib/components/Toast.js';
import { numT } from '../lib/common/lit/runtime/types/numT.js';
import { strT } from '../lib/common/lit/runtime/types/strT.js';
import { Input } from '../lib/components/Input.js';
import '../lib/components/Dialog.js';
import { boolT } from '../lib/common/lit/runtime/types/boolT.js';
import { arrT } from '../lib/common/lit/runtime/types/arrT.js';

/**
 * @typedef {{
 * 	id: string;
 * 	title: string;
 * 	description: string;
 * 	done: boolean;
 * 	priority: NotePriorities;
 * 	owner: string;
 * 	dateCreated: string;
 * 	dateModified: string;
 * 	peepeepoopoo: 'peepeepoopoo';
 * }} NoteRes
 */
/**
 * @typedef {{
 * 	id: string;
 * 	title: string;
 * 	description: string;
 * 	done: boolean;
 * 	priority: NotePriorities;
 * 	owner: {
 * 		id: string;
 * 		username: string;
 * 		email: string;
 * 		peepeepoopoo: 'peepeepoopoo';
 * 	};
 * 	dateCreated: Date;
 * 	dateModified: Date;
 * 	peepeepoopoo: string;
 * }} Note
 */

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

	/** @typedef {(typeof AppRoute)['NoteSortKinds'][keyof (typeof AppRoute)['NoteSortKinds']]} NoteSortKinds */
	static NoteSortKinds = /** @type {const} */ ({
		DATE_CREATED: 'date-created',
		DATE_MODIFIED: 'date-modified',
		ALPHANUMERIC: 'alphanumeric',
	});

	/** @typedef {(typeof AppRoute)['NotePriorities'][keyof (typeof AppRoute)['NotePriorities']]} NotePriorities */
	static NotePriorities = /** @type {const} */ ({
		NORMAL: 0,
		IMPORTANT: 1,
		URGENT: 2,
	});

	static NoteSorters = {
		[this.NoteSortKinds.DATE_CREATED]: (
			/** @type {Note} */ a,
			/** @type {Note} */ b,
		) => (a.dateCreated < b.dateCreated ? -1 : 1),
		[this.NoteSortKinds.DATE_MODIFIED]: (
			/** @type {Note} */ a,
			/** @type {Note} */ b,
		) => (a.dateModified < b.dateModified ? -1 : 1),
		[this.NoteSortKinds.ALPHANUMERIC]: (
			/** @type {Note} */ a,
			/** @type {Note} */ b,
		) => a.title.localeCompare(b.title),
	};

	constructor() {
		super();

		/** @type {Note[] | undefined} */ this.notes;
		/** @type {{ title: string; description: string }[]} */ this.notePlaceholders =
			[];
		/** @type {Promise<Note[]>} */ this.notesPromise;
		/** @type {1 | -1} */ this.noteSortOrder = -1;
		/** @type {NoteSortKinds} */ this.noteSortKind =
			AppRoute.NoteSortKinds.DATE_MODIFIED;
		/** @type {string} */ this.noteSearchQuery = '';
		/** @type {boolean} */ this.noteDialogOpen = false;
		/** @type {Note | undefined} */ this.noteDialogNote;

		/** @type {Note['owner'] | undefined} */ this.user;
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

	/**
	 * @returns {| Promise<{
	 * 			id: string;
	 * 			username: string;
	 * 			email: string;
	 * 			peepeepoopoo: 'peepeepoopoo';
	 * 	  }>
	 * 	| never}
	 */
	async #getUser() {
		if (this.user) return this.user;

		const res = await fetch('/api/v1/auth/user');
		const user = await res.json();

		this.user = user.data;

		return user.data;
	}

	/** @returns {Promise<Note[]>} */
	async #getNotes() {
		const user = await this.#getUser();

		// fake timeout cuz our server is too fast
		await new Promise((resolve) => void setTimeout(resolve, 1000));
		const res = await fetch('/api/v1/note/all');
		const json =
			/** @type {import('../lib/common/x/X.js').Res<NoteRes[]>} */ (
				await res.json()
			);

		if (!res.ok && !json.ok)
			Toaster.toast(
				json.error.message || 'Failed to fetch notes',
				Toast.variants.error,
			);
		else if (res.ok && json.ok)
			return json.data.map((note) => {
				// if (note.owner !== user.id)
				// 	throw new Error(
				// 		"Oh nyo! Encountered note whose owner is not of the same user that's signed-in. This is a bug!",
				// 	);

				const dateCreated = new Date(note.dateCreated);
				const dateModified = new Date(note.dateModified);

				return {
					id: note.id,
					title: note.title,
					description: note.description,
					done: note.done,
					priority: note.priority,
					owner: user,
					dateCreated,
					dateModified,
					peepeepoopoo: note.peepeepoopoo,
				};
			});

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

		let data;
		try {
			const res = await fetch('/api/v1/note/create.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title,
					description,
				}),
			});
			data = await res.json();
		} catch {
			Toaster.toast('Network error', Toast.variants.error);

			return;
		}

		if (!data.ok) {
			switch (data.err.code) {
				default:
					Toaster.toast(
						`Failed to create note (${data.err.code})`,
						Toast.variants.error,
					);
			}

			return;
		}

		Toaster.toast('Successfully created note', Toast.variants.ok);

		await this.#refreshNotes();
	}

	async #toggleDoneNoteAndToast(
		/** @type {Note} */ note,
		/** @type {boolean} */ done = !note.done,
	) {
		const message = done ? 'note as done' : 'note as not done';
		// const { cancel } = Toaster.toast(`Marking ${message}…`);

		note.done = done;

		this.requestUpdate('notes');

		let data;
		try {
			const res = await fetch(`/api/v1/note/edit`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: note.id,
					done,
				}),
			});

			data = await res.json();
		} catch {
			Toaster.toast('Network error', Toast.variants.error);

			return;
		}

		// cancel();

		if (!data.ok) {
			switch (data.err.code) {
				case 'NOTE_NOT_FOUND':
					Toaster.toast(
						'Note not found. It may have been deleted by another session.',
						Toast.variants.error,
					);
					break;
				default:
					Toaster.toast(
						`Failed to update note (${data.err.code})`,
						Toast.variants.error,
					);
			}

			return;
		}

		// Toaster.toast(`Successfully marked ${message}`, Toast.variants.ok);

		this.#refreshNotes();
	}

	async #editNoteAndToast(
		/** @type {Note} */ note,
		/**
		 * @type {Partial<{
		 * 	title: string;
		 * 	description: string;
		 * 	done: boolean;
		 * 	priority: NotePriorities;
		 * }>}
		 */ { title, description, done, priority },
	) {
		const { cancel } = Toaster.toast('Updating note…');

		if (title) note.title = title;
		if (description) note.description = description;
		if (done) note.done = done;
		if (priority) note.priority = priority;
		if (title || description) note.dateModified = new Date();

		this.requestUpdate('notes');

		let data;
		try {
			const res = await fetch(`/api/v1/note/edit`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: note.id,
					title,
					description,
				}),
			});

			data = await res.json();
		} catch {
			Toaster.toast('Network error', Toast.variants.error);

			return;
		}

		cancel();

		if (!data.ok) {
			switch (data.err.code) {
				case 'NOTE_NOT_FOUND':
					Toaster.toast(
						'Note not found. It may have been deleted by another session.',
						Toast.variants.error,
					);
					break;
				default:
					Toaster.toast(
						`Failed to update note (${data.err.code})`,
						Toast.variants.error,
					);
			}

			return;
		}

		Toaster.toast('Successfully updated note', Toast.variants.ok);

		this.#refreshNotes();
	}

	async #deleteNoteAndToast(/** @type {Note} */ note) {
		const { cancel } = Toaster.toast('Deleting note…');

		this.notes?.splice(this.notes.indexOf(note), 1);
		this.requestUpdate('notes');

		let data;
		try {
			const res = await fetch(`/api/v1/note/delete`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: note.id,
				}),
			});

			data = await res.json();
		} catch {
			Toaster.toast('Network error', Toast.variants.error);

			return;
		}

		cancel();

		if (!data.ok) {
			switch (data.err.code) {
				case 'NOTE_NOT_FOUND':
					Toaster.toast(
						'Note not found. It may have already been deleted',
						Toast.variants.error,
					);
					break;
				default:
					Toaster.toast(
						data.err.message ||
							`Failed to create note (${data.err.code})`,
						Toast.variants.error,
					);
			}

			return;
		}

		Toaster.toast('Note deleted', Toast.variants.ok);
	}

	#getSortedAndFilteredNotes(/** @type {Note[]} */ notes) {
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
					AppRoute.NoteSorters[this.noteSortKind](a, b) *
					this.noteSortOrder,
			);
		// .sort(
		// 	(a, b) =>
		// 		(a.done === b.done ? 0 : a.done ? 1 : -1) *
		// 		this.noteSortOrder,
		// );
	}

	/** @override */
	render() {
		return html`
			<x-main>
				<x-app-menu-fragment slot="menu"></x-app-menu-fragment>
				<x-app-cta-fragment
					slot="cta"
					@refresh=${() => {
						void this.#refreshAndToastNotes();
					}}
				></x-app-cta-fragment>
				<div class="content">
					<div class="heading">
						<h5>
							${new Date().getHours() < 4
								? 'Late nights.'
								: new Date().getHours() < 12
								? 'Good morning.'
								: new Date().getHours() < 18
								? 'Good afternoon.'
								: new Date().getHours() < 18
								? 'Good evening.'
								: 'Good night.'}
						</h5>
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
								height="21px"
								width="21px"
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
												value: AppRoute.NoteSortKinds
													.DATE_MODIFIED,
												selected: true,
											},
											{
												icon: 'today',
												title: 'Created',
												value: AppRoute.NoteSortKinds
													.DATE_CREATED,
											},
											{
												icon: 'sort_by_alpha',
												title: 'Alphabetical',
												value: AppRoute.NoteSortKinds
													.ALPHANUMERIC,
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
