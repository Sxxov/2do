export const convertSqlDatetimeToDateIsoString = (
	/** @type {string} */ datetime,
) => {
	return `${datetime.replace(' ', 'T')}.000Z`;
};
