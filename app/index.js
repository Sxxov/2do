import { X, css, html, until } from '../lib/common/x/X.js';
import '../lib/layout/Main.js';
import './lib/components/AppCtaFragment.js';
import './lib/components/AppMenuFragment.js';
import '../lib/components/LoaderCircle.js';
import '../lib/components/LoaderSkeleton.js';
import './lib/components/NoteItem.js';
import { objT } from '../lib/common/lit/runtime/types/objT.js';
import { stateT } from '../lib/common/lit/runtime/traits/stateT.js';
import { Toaster } from '../lib/components/Toaster.js';
import { Toast } from '../lib/components/Toast.js';

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
	};

	constructor() {
		super();

		/** @type {Promise<Note[]>} */ this.notesPromise;
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();

		this.#updateNotes();
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

	async #updateNotes() {
		this.notesPromise = this.#getNotes();

		await this.notesPromise;
	}

	/** @returns {Promise<Note[]>} */
	async #getNotes() {
		const user = await this.#getSessionUser();

		await new Promise((resolve) => void setTimeout(resolve, 1000));
		// const res = await fetch('/api/v1/note/all');
		// const notes = /** @type {NoteRes[]} */ (await res.json());
		const notes = [
			{
				id: '1',
				title: 'Note 1',
				description: 'This is a note.',
				owner: user.id,
				dateCreated: new Date()
					.toISOString()
					.slice(0, 19)
					.replace('T', ' '),
				dateModified: new Date()
					.toISOString()
					.slice(0, 19)
					.replace('T', ' '),
				peepeepoopoo: 'peepeepoopoo',
			},
		]; // stub

		return notes.map((note) => {
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
	}

	/** @override */
	render() {
		return html`
			<x-main>
				<x-app-menu-fragment slot="menu"></x-app-menu-fragment>
				<x-app-cta-fragment
					slot="cta"
					@refresh=${async () => {
						const { cancel } = Toaster.toast('Refreshing notes...');

						await this.#updateNotes();

						cancel();

						Toaster.toast('Notes refreshed!', Toast.variants.ok);
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
								height="28px"
								width="28px"
							></x-loader-circle>`,
						)}
					</div>
					<div class="notes">
						${until(
							this.notesPromise.then((notes) =>
								notes.map(
									(note) => html`
										<x-note-item
											title=${note.title}
											description=${note.description}
										></x-note-item>
									`,
								),
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
		`,
	];
}
customElements.define('x-index', AppRoute);
