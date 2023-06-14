/** @returns {[x: number, y: number]} */
export const resolveClientCoordinates = (
	/** @type {MouseEvent | TouchEvent} */ event,
) => {
	return typeof TouchEvent !== 'undefined' && event instanceof TouchEvent
		? [
				/** @type {Touch} */ (event.touches[0]).clientX,
				/** @type {Touch} */ (event.touches[0]).clientY,
		  ]
		: typeof MouseEvent !== 'undefined' && event instanceof MouseEvent
		? [event.clientX, event.clientY]
		: [NaN, NaN];
};
