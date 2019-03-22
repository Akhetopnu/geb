import { append_child, on as dom_on, elem, exec, frag, parent } from './dom';
import { pipe } from './function';

const appendable = factory => ([root, ...rest]) => [append_chid(root, factory()), ...rest];
// const appended = factory => root => (root.appendChild(factory()), root);

const elem$ = tag => () => elem(tag);

export const create = tag => appendable(elem$(tag));
export const finalize = ([root, , ...rest]) => [root, ...rest];

export const builder = (...pipes) => pipe(
	data => [frag(), data, new Map, []],
	...pipes,
	finalize,
);

const parent$ = ([root, ...rest]) => [parent(root), ...rest];
const put = (...pipes) => pipe(...pipes, parent$);

export const attr = attr => val => exec(([node]) => node.setAttribute(attr, val));
export const prop = prop => val => exec(([node]) => node[prop] = val);
export const type = attr('type');

export const factory = tag => (creator => (...pipes) => put(creator, ...pipes))(create(tag));
export const div = factory('div');
export const input = factory('input');
export const button = factory('button');
export const textarea = factory('textarea');

export const ref = key => exec(([node, , map]) => map.set(key, node));
export const on = event => listener => node => dom_on(node, event, listener);

export const radio = type('radio');
export const name = attr('name');
export const hidden = attr('hidden')('');
export const checked = attr('checked')('');
export const klass = attr('class');
export const id = prop('id');
export const text = prop('textContent');
export const value = prop('id');
export const placeholder = prop('placeholder');
export const value = prop('value');

export const bind = (setter, transformer) => exec(([node,,, watchers]) =>
	watchers.push(data => setter(transformer(data))([node])));

// export const bind = (setter, signal, initial) => {
// 	console.log(setter, signal, initial);
//
// 	exec(([node, _, refs, watchers]) => {
//
// 		if (!watchers.has(node)) {
// 			watchers.set(node, []);
// 		}
//
// 		watchers.get(node).push([signal, setter]);
// 		setter(initial)(node);
// 	});
//
// };