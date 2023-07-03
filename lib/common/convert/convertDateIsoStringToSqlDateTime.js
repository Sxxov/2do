export const convertDateIsoStringToSqlDateTime = (
	/** @type {string} */ date,
) => {
	const str = date.slice(0, 19);
	if (str.length === 16) return `${str}:00`;

	return str.replace('T', ' ');
};
