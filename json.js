import * as logger from './logger';

export const str = JSON.stringify;
export const parse = JSON.parse;
export function parse_safe(message) {
	let result = null;
	try {
		result = parse(message);
	} catch (error) {
		logger.error('Could not parse message:', message);
	} finally {
		return result;
	}
}
