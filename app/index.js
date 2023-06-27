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

/**
 * @typedef {{
 * 	id: string;
 * 	title: string;
 * 	description: string;
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
		notesPromise: objT(stateT),
		noteSortOrder: numT(stateT),
		noteSortKind: strT(stateT),
		noteSearchQuery: strT(stateT),
	};

	/** @typedef {(typeof AppRoute)['NoteSortKinds'][keyof (typeof AppRoute)['NoteSortKinds']]} NoteSortKinds */

	static NoteSortKinds = /** @type {const} */ ({
		DATE_CREATED: 'date-created',
		DATE_MODIFIED: 'date-modified',
		ALPHANUMERIC: 'alphanumeric',
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

		/** @type {Promise<Note[]>} */ this.notesPromise;
		/** @type {1 | -1} */ this.noteSortOrder = 1;
		/** @type {NoteSortKinds} */ this.noteSortKind =
			AppRoute.NoteSortKinds.DATE_MODIFIED;
		/** @type {string} */ this.noteSearchQuery = '';
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();

		this.notesPromise = this.#getNotes();
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
	async #getSessionUser() {
		const res = await fetch('/api/v1/auth/user');
		const user = await res.json();

		return user.data;
	}

	/** @returns {Promise<Note[]>} */
	async #getNotes() {
		const user = await this.#getSessionUser();

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
				if (note.owner !== user.id)
					throw new Error(
						"Oh nyo! Encountered note whose owner is not of the same user that's signed-in. This is a bug!",
					);

				const dateCreated = new Date(note.dateCreated);
				const dateModified = new Date(note.dateModified);

				return {
					id: note.id,
					title: note.title,
					description: note.description,
					owner: user,
					dateCreated,
					dateModified,
					peepeepoopoo: note.peepeepoopoo,
				};
			});

		return [];
	}

	#createNote() {}

	async #refreshNotes() {
		const { cancel } = Toaster.toast('Refreshing notes…');

		this.notesPromise = this.#getNotes();
		await this.notesPromise;

		cancel();

		Toaster.toast('Notes refreshed', Toast.variants.ok);
	}

	/** @override */
	render() {
		return html`
			<x-main>
				<x-app-menu-fragment slot="menu"></x-app-menu-fragment>
				<x-app-cta-fragment
					slot="cta"
					@refresh=${() => {
						void this.#refreshNotes();
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
							this.notesPromise.then(
								({ length }) =>
									html`<p>
										${length}
										thing${length === 1 ? '' : 's'} left to
										do
									</p>`,
							),
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
									this.#createNote();
								}}
								><x-i slot="left">sticky_note_2</x-i>Add a
								note<x-i slot="right">add</x-i></x-button
							>
						</div>
						${until(
							this.notesPromise.then((notes) =>
								notes.length > 0
									? repeat(
											notes
												.filter(
													(v) =>
														this.noteSearchQuery ===
															'' ||
														v.title
															.toLowerCase()
															.includes(
																this.noteSearchQuery.toLowerCase(),
															) ||
														v.description
															.toLowerCase()
															.includes(
																this.noteSearchQuery.toLowerCase(),
															),
												)
												.sort(
													(a, b) =>
														AppRoute.NoteSorters[
															this.noteSortKind
														](a, b) *
														this.noteSortOrder,
												),
											(note) => note.id,
											(note) => html`
												<x-note-item
													title=${note.title}
													description=${note.description}
												></x-note-item>
											`,
									  )
									: html`<p class="empty">
											👌<br /><br />All done!
									  </p>`,
							),
							html`<x-loader-skeleton
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
								></x-loader-skeleton>`,
						)}
						<div class="refresh">
							<x-button
								${spread(Button.variants.secondary)}
								@click=${() => {
									void this.#refreshNotes();
								}}
							>
								<x-i>refresh</x-i>
							</x-button>
						</div>
					</div>
				</div>
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
		`,
	];
}
customElements.define('x-index', AppRoute);
