import { whenResize } from '../../lib/common/actions/when/whenResize.js';
import { Tween } from '../../lib/common/animation/Tween.js';
import { bezierQuintOut } from '../../lib/common/bezier/beziers/bezierQuintOut.js';
import { bondage } from '../../lib/common/functional/bondage.js';
import { Cleaner } from '../../lib/common/lit/lifecycle/Cleaner.js';
import { stateT } from '../../lib/common/lit/runtime/traits/stateT.js';
import { arrT } from '../../lib/common/lit/runtime/types/arrT.js';
import { boolT } from '../../lib/common/lit/runtime/types/boolT.js';
import { numT } from '../../lib/common/lit/runtime/types/numT.js';
import { objT } from '../../lib/common/lit/runtime/types/objT.js';
import { clamp } from '../../lib/common/math/clamp.js';
import { X, css, html, nothing, spread } from '../../lib/common/x/X.js';
import { Button } from '../../lib/components/Button.js';
import '../../lib/components/Button.js';
import '../../lib/components/Spacer.js';
import { Toast } from '../../lib/components/Toast.js';
import { Toaster } from '../../lib/components/Toaster.js';
import '../../lib/layout/Main.js';
import '../lib/components/AppNavMenuFragment.js';
import '../lib/components/NoteDialog.js';
import { NoteManager, NotePriorities } from '../lib/core/NoteManager.js';

export class AppCalendarRoute extends X {
	/**
	 * @type {import('lit-element').PropertyDeclarations}
	 * @override
	 */
	static properties = {
		year: numT(stateT),
		month: numT(stateT),

		notes: arrT(stateT),
		noteDialogOpen: boolT(stateT),
		noteDialogNote: objT(stateT),

		innerWidth: numT(stateT),
	};

	#scrollLeft = 0;
	/** @type {Tween | undefined} */
	#scrollTween = undefined;

	#cleaner = new Cleaner();

	constructor() {
		super();

		/** @type {number} */ this.year;
		/** @type {number} */ this.month;

		/** @type {import('../lib/core/NoteManager.js').Note[] | undefined} */ this
			.notes;
		/** @type {boolean} */ this.noteDialogOpen = false;
		/** @type {import('../lib/core/NoteManager.js').Note | undefined} */ this.noteDialogNote =
			undefined;

		/** @type {number} */ this.innerWidth = 0;
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();

		this.#cleaner.add(
			bondage(
				whenResize(this, ({ width }) => {
					this.innerWidth = width;
				}),
			).destroy,
		);

		this.#refreshNotes();
	}

	/** @override */
	disconnectedCallback() {
		super.disconnectedCallback();

		this.#cleaner.flush();
	}

	/** @returns {Promise<import('../lib/core/NoteManager.js').Note[]>} */
	async #getNotes() {
		const [res, err] = await NoteManager.instance.getAll();

		if (err)
			for (const e of err) Toaster.toast(e.message, Toast.variants.error);

		if (res) return res;

		return [];
	}

	async #refreshNotes(clear = false) {
		if (clear) this.notes = undefined;
		this.notes = await this.#getNotes();
	}

	async #refreshAndToastNotes() {
		const { cancel } = Toaster.toast('Refreshing notes…');

		await this.#refreshNotes(true);

		cancel();

		Toaster.toast('Notes refreshed', Toast.variants.ok);
	}

	/** @override */
	render() {
		return html`
			<x-main
				defoot
				@wheel=${(
					/**
					 * @type {WheelEvent & {
					 * 	currentTarget: HTMLDivElement;
					 * }}
					 */ e,
				) => {
					const { currentTarget } = e;
					const from = this.#scrollLeft;
					const to = clamp(
						from + e.deltaY,
						0,
						currentTarget.scrollWidth - currentTarget.clientWidth,
					);

					if (this.#scrollLeft === to) return;

					currentTarget.scrollTo(this.#scrollLeft, 0);
					this.#scrollLeft = to;
					this.#scrollTween?.destroy();
					this.#scrollTween = new Tween(
						from,
						to,
						200,
						bezierQuintOut,
					);
					this.#scrollTween.play();
					this.#scrollTween.subscribe((progress) => {
						currentTarget.scrollTo(progress, 0);
					});
				}}
			>
				<div slot="nav-left">
					<x-button
						${spread(Button.variants.secondary)}
						@click=${() => {
							location.href = '/app';
						}}
					>
						<x-i slot="left">list</x-i>
						List view
					</x-button>
				</div>
				<x-app-nav-menu-fragment
					slot="nav-menu"
				></x-app-nav-menu-fragment>
				<div slot="nav-right">
					<x-button
						${spread(Button.variants.secondary)}
						@click=${() => {
							void this.#refreshAndToastNotes();
						}}
					>
						<x-i>refresh</x-i>
					</x-button>
				</div>
				<div class="new">
					<x-button
						width="100%"
						${spread(Button.variants.primary)}
						${spread(Button.variants.shadowSm)}
						@click=${() => {
							this.noteDialogNote = undefined;
							this.noteDialogOpen = true;
						}}
						><x-i slot="left">sticky_note_2</x-i>Add a note<x-i
							slot="right"
							>add</x-i
						></x-button
					>
				</div>
				<div class="calendar weekly">
					<div class="day-labels">
						${(this.innerWidth < 800
							? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
							: [
									'Sunday',
									'Monday',
									'Tuesday',
									'Wednesday',
									'Thursday',
									'Friday',
									'Saturday',
							  ]
						).map((dayName, dayI) => {
							const now = new Date();
							const dayDate = new Date(
								now.getFullYear(),
								now.getMonth(),
								now.getDate() - now.getDay() + dayI,
							);

							return html`<div class="label">
								<p class="name">${dayName}</p>
								<p class="date">
									${dayDate.toLocaleDateString(undefined, {
										month: 'short',
										day: 'numeric',
									})}
								</p>
							</div>`;
						})}
					</div>

					<div class="days">
						<div class="hour-labels">
							${Array(24)
								.fill(undefined)
								.map((_, i) => (i + 0) % 24)
								.map(
									(i) =>
										html`<div class="label">
											<p>
												${i % 12 || 12}${i >= 12
													? 'pm'
													: 'am'}
											</p>
										</div>`,
								)}
						</div>
						${Array(7)
							.fill(undefined)
							.map((_, i) => (i + 0) % 7)
							.map(
								(dayI) =>
									html`<div class="day">
										${Array(24)
											.fill(undefined)
											.map((_, i) => (i + 0) % 24)
											.map(
												(hourI) =>
													html`<div class="hour">
														${this.notes
															? this.notes.map(
																	(note) => {
																		if (
																			note.done
																		)
																			return nothing;

																		const startAbs =
																			note.dateStart;
																		const endAbs =
																			note.dateDue.getFullYear() <=
																			1970
																				? note.dateStart
																				: note.dateDue;
																		const now =
																			new Date();
																		const hour =
																			new Date(
																				now.getFullYear(),
																				now.getMonth(),
																				now.getDate() -
																					now.getDay() +
																					dayI,
																				hourI,
																			);
																		const startRel =
																			clamp(
																				startAbs.getTime() -
																					hour.getTime(),
																				0,
																				1000 *
																					60 *
																					60,
																			);
																		const endRel =
																			clamp(
																				endAbs.getTime() -
																					hour.getTime(),
																				0,
																				1000 *
																					60 *
																					60,
																			);
																		const isNoteInHour =
																			(startAbs.getTime() <=
																				hour.getTime() ||
																				startAbs.getTime() <
																					hour.getTime() +
																						1000 *
																							60 *
																							60) &&
																			(endAbs.getTime() >=
																				hour.getTime() +
																					1000 *
																						60 *
																						60 ||
																				endAbs.getTime() >
																					hour.getTime());

																		if (
																			!isNoteInHour
																		)
																			return nothing;

																		const isStartInHour =
																			startAbs.getTime() >=
																				hour.getTime() &&
																			startAbs.getTime() <
																				hour.getTime() +
																					1000 *
																						60 *
																						60;
																		const isEndInHour =
																			endAbs.getTime() >=
																				hour.getTime() &&
																			endAbs.getTime() <
																				hour.getTime() +
																					1000 *
																						60 *
																						60;
																		const leftPos = `${
																			(startRel /
																				1000 /
																				60 /
																				60) *
																			100
																		}%`;
																		const width = `${
																			((endRel -
																				startRel) /
																				1000 /
																				60 /
																				60) *
																			100
																		}%`;

																		return html`<div
																			class="note"
																		>
																			${startRel >
																			0
																				? html`<x-spacer
																						width=${leftPos}
																				  ></x-spacer>`
																				: nothing}<x-button
																				width=${width}
																				height="${note.priority ===
																				NotePriorities.NORMAL
																					? '14px'
																					: note.priority ===
																					  NotePriorities.IMPORTANT
																					? '28px'
																					: note.priority ===
																					  NotePriorities.URGENT
																					? '56px'
																					: 'auto'}"
																				${spread(
																					Button
																						.variants
																						.secondary,
																				)}
																				${spread(
																					Button
																						.variants
																						.shadowSm,
																				)}
																				${spread(
																					{
																						...(isStartInHour
																							? Button
																									.variants
																									.flatRight
																							: isEndInHour
																							? Button
																									.variants
																									.flatLeft
																							: Button
																									.variants
																									.flat),
																						'.padding':
																							'7px',
																					},
																				)}
																				@click=${() => {
																					this.noteDialogOpen = true;
																					this.noteDialogNote =
																						note;
																				}}
																			>
																				<p>
																					${note.title}
																				</p>
																			</x-button>
																		</div>`;
																	},
															  )
															: nothing}
													</div>`,
											)}
									</div>`,
							)}
					</div>
				</div>
				<x-note-dialog
					.open=${this.noteDialogOpen}
					.note=${this.noteDialogNote}
					@close=${() => {
						this.noteDialogOpen = false;
					}}
					@edit=${(/** @type {CustomEvent} */ e) => {
						this.requestUpdate('notes');
					}}
					@refresh=${(/** @type {CustomEvent} */ e) => {
						this.#refreshNotes();
					}}
				></x-note-dialog>
			</x-main>
		`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			:host {
				display: block;
			}

			x-main {
				overflow-y: clip;
			}

			.new {
				position: absolute;
				bottom: 0;
				right: 0;
				padding: 14px;
				z-index: 8;
			}

			.calendar.weekly {
				--width-tile: calc((100vh - 84px) / 7);

				display: flex;

				height: calc(100vh - 84px);
				width: max-content;
			}

			.calendar.weekly > .day-labels {
				position: sticky;
				left: 0;

				display: flex;
				flex-direction: column;

				height: 100%;

				z-index: 8;

				box-shadow: var(----shadow-md);
			}

			.calendar.weekly > .day-labels > .label {
				flex-grow: 1;
				width: 100%;

				display: flex;
				gap: 3.5px;
				flex-direction: column;
				align-items: flex-start;
				justify-content: flex-start;
				padding: 14px;
				box-sizing: border-box;

				border-right: 1px solid var(----colour-background-secondary);
				border-top: 1px solid var(----colour-background-secondary);

				min-width: 200px;

				background: var(----colour-background-primary);
			}

			@media (max-width: 800px) {
				.calendar.weekly > .day-labels > .label {
					/* padding: 7px; */

					min-width: unset;
				}
			}

			.calendar.weekly > .day-labels > .label > .name {
				margin: 0;

				color: var(----colour-text-secondary);
			}

			.calendar.weekly > .day-labels > .label > .date {
				margin: 0;

				color: var(----colour-text-secondary);
				font-weight: 100;
				opacity: 0.5;
			}

			.calendar.weekly > .days {
				display: flex;
				flex-direction: column;
				flex-grow: 1;

				width: max-content;
			}

			.calendar.weekly > .days > .day {
				display: flex;
				flex-direction: row;
				flex-grow: 1;
				height: calc(100% / 7);
			}

			.calendar.weekly > .days > .day > .hour {
				border-right: 1px dashed var(----colour-background-secondary);
				border-bottom: 1px solid var(----colour-background-secondary);
				/* aspect-ratio: 1 / 1; */
				height: 100%;
				width: var(--width-tile);

				display: flex;
				flex-direction: column;

				overflow: hidden;
			}

			.calendar.weekly > .days > .day > .hour > .note {
				display: flex;
			}

			.calendar.weekly > .days > .day > .hour > .note p {
				margin: 0;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.calendar.weekly > .days > .hour-labels {
				position: sticky;
				left: 0;
				height: 0;

				display: flex;
				flex-direction: row;

				width: 100%;
			}

			.calendar.weekly > .days > .hour-labels > .label {
				flex-grow: 1;
				height: 28px;
				width: var(--width-tile);

				display: flex;
				/* align-items: center; */
				justify-content: center;
				padding: 14px;
				box-sizing: border-box;
			}

			.calendar.weekly > .days > .hour-labels > .label > p {
				margin: 0;

				color: var(----colour-text-secondary);
				opacity: 0.2;
			}
		`,
	];
}
customElements.define('x-index', AppCalendarRoute);
