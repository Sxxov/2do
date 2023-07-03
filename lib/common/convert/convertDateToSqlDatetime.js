import { convertDateIsoStringToSqlDateTime } from './convertDateIsoStringToSqlDateTime.js';

export const convertDateToSqlDatetime = (/** @type {Date} */ date) => {
	return convertDateIsoStringToSqlDateTime(date.toISOString());
};
