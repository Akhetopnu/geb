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
