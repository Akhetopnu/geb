export const tick = (generator, ...args) => {
	const $ = generator(...args);
	$.next();
	$.next($);
};
export const next = (generator, value) =>
	generator.next(value);
