/**
 * @typedef {{
 * 	id: string;
 * 	title: string;
 * 	description: string;
 * 	done: boolean;
 * 	priority: NotePriority;
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

/** @typedef {OneOf<NoteSortKinds>} NoteSortKind */
export const NoteSortKinds = /** @type {const} */ ({
	DATE_CREATED: 'date-created',
	DATE_MODIFIED: 'date-modified',
	ALPHANUMERIC: 'alphanumeric',
});

/** @typedef {OneOf<NotePriorities>} NotePriority */
export const NotePriorities = /** @type {const} */ ({
	NORMAL: 0,
	IMPORTANT: 1,
	URGENT: 2,
});

/** @typedef {OneOf<NoteSorters>} NoteSorter */
export const NoteSorters = {
	[NoteSortKinds.DATE_CREATED]: (
		/** @type {Note} */ a,
		/** @type {Note} */ b,
	) => (a.dateCreated < b.dateCreated ? -1 : 1),
	[NoteSortKinds.DATE_MODIFIED]: (
		/** @type {Note} */ a,
		/** @type {Note} */ b,
	) => (a.dateModified < b.dateModified ? -1 : 1),
	[NoteSortKinds.ALPHANUMERIC]: (
		/** @type {Note} */ a,
		/** @type {Note} */ b,
	) => a.title.localeCompare(b.title),
};

export class NoteManager {
	/** @returns {Promise<ResultStrict<Note>>} */
	async edit(
		/** @type {Note} */ note,
		/**
		 * @type {Partial<{
		 * 	title: string;
		 * 	description: string;
		 * 	done: boolean;
		 * 	priority: NotePriority;
		 * }>}
		 */ { title, description, done, priority },
	) {
		if (title) note.title = title;
		if (description) note.description = description;
		if (done) note.done = done;
		if (priority) note.priority = priority;
		if (title || description) note.dateModified = new Date();

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
			return [undefined, [new Error('Network error')]];
		}

		if (!data.ok) {
			switch (data.error.code) {
				case 'NOTE_NOT_FOUND':
					return [
						undefined,
						[
							new Error(
								'Note not found. It may have been deleted by another session.',
								{
									cause: data.error,
								},
							),
						],
					];
				default:
					return [
						undefined,
						[
							new Error(
								`Failed to update note (${data.error.code})`,
								{
									cause: data.error,
								},
							),
						],
					];
			}
		}

		return [data.data, undefined];
	}

	async getNotes() {
		let data;
		try {
			const res = await fetch('/api/v1/note/all');

			data = /**
			 * @type {ApiAny<
			 * 	{
			 * 		id: string;
			 * 		title: string;
			 * 		description: string;
			 * 		done: boolean;
			 * 		priority: import('./lib/core/NoteManager.js').NotePriority;
			 * 		owner: string;
			 * 		dateCreated: string;
			 * 		dateModified: string;
			 * 		peepeepoopoo: 'peepeepoopoo';
			 * 	}[]
			 * >}
			 */ (await res.json());
		} catch (err) {
			return [
				undefined,
				[new Error('Network error', {
					cause: err,
				})],
			];
		}

		if (!res.ok && !json.ok)
			Toaster.toast(
				json.error.message || 'Failed to fetch notes',
				Toast.variants.error,
			);
		else if (res.ok && json.ok)
			return json.data.map((note) => {
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
}
