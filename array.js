import * as json from './json';
import * as object from './object';
import { complement } from './bool';

export const EMPTY = object.freeze([]);
const ARRAY = Array;

const truth = () => true;
export const test = (len, fn = truth) => list =>
	ARRAY.isArray(list) &&
	list.length === len &&
	fn(list);

export const wrap = val => [val];
export const first = array => array[0];
export const second = array => array[1];
export const third = array => array[2];
export const slice = x => list => list.slice(x);
export const rest = slice(1);
export const cartesian = list_a => list_b =>
	list_a
		.map(item_a => list_b.map(item_b => [item_a, item_b]))
		.flatMap(x => x);

export const foreach = fn => array => (array.forEach(fn), array);
export const map = fn => array => array.map(fn);
export const filter = (fn = Boolean) => array => array.filter(fn);
export const filter_fork = (fn = Boolean, sidepath) => array => {
	sidepath(array.filter(complement(fn)));
	return array.filter(fn);
};
export const concat = fn => array => [...array, fn(array)];
export const flatmap = fn => array => [...array, fn(array)];
export const every = fn => array => array.every(fn);
export const some = fn => array => array.some(fn);

export const ensure = (obj, key) => obj[key] || (obj[key] = []);

export const push = (list, item) => (list.push(item), item);
export const $push = (list, item) => (list.push(item), list);
export const $push_i = (list, item) => (list.push(item), item);
export const from = list => ARRAY.from(list);
export const length = list => list.length;
export const length_is = x => list => length(list) === x;
export const create = (len = 0) => new ARRAY(len);
export const splice = (array, index) => array.splice(index, 1);
export const copyAsNumeric = list => json.parse(
	json.str(list).replace(/"(\d+)"/g, '$1')
);

export const each = function(list, fn) {
	list.forEach(fn);
	return list;
};

export default each;
export function forEach (list, fn) {
	let i = -1;
	for (const item of list) {
		fn(item, ++i, list);
	}
}
// export function map(list, fn) {
// 	let i = -1;
// 	const result = create(length(list));
// 	for (const item of list) {
// 		result[++i] = fn(item, i, list);
// 	}
//
// 	return result;
// }
export function reduce(list, fn, value) {
	let i = -1;
	for (const item of list) {
		value = fn(value, item, ++i, list);
	}

	return value;
}
export function remove_by_test(list, check) {
	let i = -1;
	for (const item of list) {
		++i;
		if (check(item)) {
			return splice(list, i);
		}
	}
}
export function remove_by_value(list, value) {
	let i = -1;
	for (const item of list) {
		++i;
		if (item === value) {
			return splice(list, i);
		}
	}
}
export function remove_by_first(list, id) {
	let i = -1;
	for (const item of list) {
		if (item[0] === id) {
			return splice(list, i)[0];
		}
	}
}
export function remove_by_id(list, id) {
	let i = -1;
	for (const item of list) {
		++i;
		if (item.id === id) {
			return splice(list, i)[0];
		}
	}
}

// export function integrate(list, item) {
// 	// item always has ['1', 'name', ...] structure
// 	let i = -1;
// 	for (const item of list) {
// 		++i;
// 		if (
// 	}
// 	const name = item[1];
// 	const length = list.length;
// 	let i = -1;
// 	while (++i < length) {
// 		if (name > list[i][1]) {
// 			return void list.splice(i + 1, 0, item);
// 		}
// 	}
// }
export function find (list, test) {
	for (const item of list) {
		if (test(item)) {
			return item;
		}
	}
}
export function find_by_first(list, id) {
	for (const item of list) {
		if (item[0] === id) {
			return item;
		}
	}

	return null;
}
export function find_by_id(list, id) {
	for (const item of list) {
		if (item.id === id) {
			return item;
		}
	}

	return null;
}
export function find_by_value_at(list, index, value) {
	for (const item of list) {
		if (item[index] === value) {
			return item;
		}
	}
}
export function filter_by_first(list, id) {
	const results = [];
	for (const item of list) {
		if (item[0] === id) {
			results.push(item);
		}
	}

	return results;
}
