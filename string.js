export function newlines(str) {
	let i = -1;
	let index = -1;
	do {
		index = str.indexOf('\n', ++index);
		i += 1;
	} while (index >= 0);

	return i;
}

export const split = on => str => str.split(on);
export const split_on_space = split(' ');
export const trim = str => str.trim();
export const lower = str => str.toLowerCase();
export const upper = str => str.toUpperCase();
export const has = (str, substr) => str.includes(substr);
export const replace = (re, placement) => str => str.replace(re, placement);
