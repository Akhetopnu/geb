import * as object from './object';

export const identity = x => x;
export const apply = (data, fn) => fn(data);
export const pipe = (...fns) => data => fns.reduce(apply, data);
export const pipe$ = (data, ...fns) => () => fns.reduce(apply, data);
export const compose = (...fns) => data => fns.reduceRight(apply, data);

export function memoize(fn) {
	const cache = object.create();
	return x => (x in cache) ? cache[x] : (cache[x] = fn(x));
}

// to raczej throttle niz debounce... (?)
export function throttle(timeout, fn) {
	let past = Date.now();

	return function(...args) {
		if (Date.now() - past >= timeout) {
			fn(...args);
			past = Date.now();
		}
	};
}

export const multiple = (...args) => fn => args.each(val => fn(val));
export const equals = a => b => a === b;
export const always = val => () => val;
