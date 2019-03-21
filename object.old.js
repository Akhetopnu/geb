export const OBJECT = Object;
export function assign(subject, extensions) {
	for (const key in extensions) {
		subject[key] = extensions[key];
	} return subject;
}
export const define = (object, property, config) => {
	OBJECT.defineProperty(object, property, config);
};
export const create = (proto = null) => OBJECT.create(proto);
export const freeze = OBJECT.freeze;
export const seal = OBJECT.seal;
export const pure = config => assign(create(), config);
// export const reverseExpand = data => (
// 	assign(data, Object.reverse(data))
// );
export const reverse = data => {
	const $ = create;
	for (const key in data) {
		$[data[key]] = key;
	}

	return $;
};
