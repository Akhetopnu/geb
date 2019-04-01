import * as object from './object';

export const is = fn => typeof fn === 'function';
export const identity = x => x;
export const apply = (data, fn) => fn(data);
export const pipe = (...fns) => data => fns.reduce(apply, data);
export const pipe$ = (data, ...fns) => () => fns.reduce(apply, data);
export const compose = (...fns) => data => fns.reduceRight(apply, data);
export const skip_arg = fn => (...args) => fn(...args.slice(1));

export const memoize = fn => (cache => x =>
	(x in cache)
		? cache[x]
		: (cache[x] = fn(x))
)(object.create());

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
