import * as settings from './settings';

export const log = (...args) =>
	console.log(...args);

export const error = console.error;

const $throw = (...args) => {
	console.error(...args);
	throw new Error(...args);
};

export { $throw as throw };

if (settings.DEBUG) {
	log('Debug mode on');
}
