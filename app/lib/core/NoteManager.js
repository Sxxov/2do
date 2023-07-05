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
 * 	dateStart: Date;
 * 	dateDue: Date;
 * 	peepeepoopoo: string;
 * }} Note
 */

import { convertDateToSqlDatetime } from '../../../lib/common/convert/convertDateToSqlDatetime.js';
import { AuthManager } from './AuthManager.js';

/** @typedef {OneOf<typeof NoteSortKinds>} NoteSortKind */
export const NoteSortKinds = /** @type {const} */ ({
	DATE_CREATED: 'date-created',
	DATE_MODIFIED: 'date-modified',
	ALPHANUMERIC: 'alphanumeric',
	PRIORITY: 'priority',
});

/** @typedef {OneOf<typeof NotePriorities>} NotePriority */
export const NotePriorities = /** @type {const} */ ({
	NORMAL: 0,
	IMPORTANT: 1,
	URGENT: 2,
});

/** @typedef {OneOf<typeof NoteSorters>} NoteSorter */
export const NoteSorters = /** @type {const} */ ({
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
	[NoteSortKinds.PRIORITY]: (/** @type {Note} */ a, /** @type {Note} */ b) =>
		a.priority - b.priority,
});

export class NoteManager {
	static instance = new NoteManager();

	async create(
		/**
		 * @type {Pick<
		 * 	Note,
		 * 	'title' | 'description' | 'dateStart' | 'dateDue' | 'priority'
		 * >}
		 */ note,
	) {
		let data;
		try {
			const res = await fetch(`/api/v1/note/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: note.title,
					description: note.description,
					dateStart: convertDateToSqlDatetime(note.dateStart),
					dateDue: convertDateToSqlDatetime(note.dateDue),
					priority: note.priority,
				}),
			});

			data = await res.json();
		} catch (err) {
			return [undefined, [new Error('Network error', { cause: err })]];
		}

		if (!data.ok) {
			switch (data.error.code) {
				case 'INVALID':
					return [
						undefined,
						[
							new Error(
								"Attempted to create a note that didn't have all the required props",
								{ cause: data.error },
							),
						],
					];
				default:
					return [
						undefined,
						[
							new Error(
								data.error.message ??
									`Failed to create note (${data.error.code})`,
								{ cause: data.error },
							),
						],
					];
			}
		}

		return [data.note, undefined];
	}

	edit(
		/** @type {Note} */ src,
		/**
		 * @type {Partial<
		 * 	Pick<
		 * 		Note,
		 * 		| 'title'
		 * 		| 'description'
		 * 		| 'done'
		 * 		| 'priority'
		 * 		| 'dateStart'
		 * 		| 'dateDue'
		 * 	>
		 * >}
		 */ from,
	) {
		const edited = { ...src, ...from };

		if (from.title || from.description || from.dateDue || from.dateStart)
			edited.dateModified = new Date();

		return edited;
	}

	/** @returns {Promise<ResultStrict<{}>>} */
	async propagate(/** @type {Note} */ note) {
		let data;
		try {
			const res = await fetch(`/api/v1/note/edit`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: note.id,
					title: note.title,
					description: note.description,
					done: note.done,
					priority: note.priority,
					dateStart: convertDateToSqlDatetime(
						new Date(
							Number(new Date(String(note.dateStart))) -
								new Date().getTimezoneOffset() * 60 * 1000,
						),
					),
					dateDue: note.dateDue
						? convertDateToSqlDatetime(
								new Date(
									Number(new Date(String(note.dateDue))) -
										new Date().getTimezoneOffset() *
											60 *
											1000,
								),
						  )
						: null,
				}),
			});

			data = await res.json();
		} catch (err) {
			return [undefined, [new Error('Network error', { cause: err })]];
		}

		if (!data.ok) {
			switch (data.error.code) {
				case 'NOT_FOUND':
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
								data.error.message ??
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

	/** @returns {Promise<ResultVoid>} */
	async delete(/** @type {Note} */ note) {
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
		} catch (err) {
			return [undefined, [new Error('Network error', { cause: err })]];
		}

		if (!data.ok) {
			switch (data.error.code) {
				case 'NOT_FOUND':
					return [
						undefined,
						[
							new Error(
								'Note not found. It may have already been deleted',
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
								data.error.message ??
									`Failed to delete note (${data.error.code})`,
								{
									cause: data.error,
								},
							),
						],
					];
			}
		}

		return [undefined, undefined];
	}

	/** @returns {Promise<ResultReasoned<Note[]>>} */
	async getAll() {
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
			 * 		priority: NotePriority;
			 * 		owner: string;
			 * 		dateCreated: string;
			 * 		dateModified: string;
			 * 		dateStart: string;
			 * 		dateDue: string;
			 * 		peepeepoopoo: 'peepeepoopoo';
			 * 	}[]
			 * >}
			 */ (await res.json());
		} catch (err) {
			return [
				undefined,
				[
					new Error('Network error', {
						cause: err,
					}),
				],
			];
		}

		if (!data.ok)
			return [
				undefined,
				[
					new Error(data.error.message ?? 'Failed to fetch notes', {
						cause: data.error,
					}),
				],
			];

		/** @type {[Error, ...Error[]] | undefined} */
		let err;
		return [
			await Promise.all(
				data.data.map(async (note) => {
					const dateCreated = new Date(note.dateCreated);
					const dateModified = new Date(note.dateModified);
					const dateStart = new Date(note.dateStart);
					const dateDue = new Date(note.dateDue);

					const [userRes, userErr] =
						await AuthManager.instance.getUser(note.owner);

					if (userErr)
						if (err) err.push(...userErr);
						else err = [...userErr];

					return {
						id: note.id,
						title: note.title,
						description: note.description,
						done: note.done,
						priority: note.priority,
						owner: {
							id: note.owner,
							username: '<unknown>',
							email: '<unknown>',
							peepeepoopoo: 'peepeepoopoo',

							...userRes?.data,
						},
						dateCreated,
						dateModified,
						dateStart,
						dateDue,
						peepeepoopoo: note.peepeepoopoo,
					};
				}),
			),
			err,
		];
	}
}
