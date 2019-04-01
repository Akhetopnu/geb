import { remove, comment, append_child, on as dom_on, off as dom_off, elem, exec, frag, parent } from './dom';
import { always, apply, is as is_function, identity, pipe } from './function';
import { is as is_array, foreach } from './array';
import * as maps from './map';
import * as settings from './settings';

const appendable = factory => ([root, ...rest]) => [append_child(root, factory()), ...rest];

export const create = tag => appendable(() => elem(tag));
const finalize = ([root,, refs, [list, update], [,destruct]]) => [
	root,
	maps.get(refs),
	update,
	destruct,
];
const updater = settings.DEBUG
	? list => patch => {
		if (Object.prototype.toString.call(patch) !== '[object Object]') {
			throw new Error(`A patch shouldbe an object, got ${JSON.stringify(patch)} instead`);
		}
		list.forEach(fn => fn(patch));
	}
	: list => patch => list.forEach(fn => fn(patch));
export const builder = (...pipes) => () => {
	const updates = [];
	const update = updater(updates);
	const destructors = [];
	const destruct = foreach(apply)(destructors);

	return finalize(pipes.reduce(apply, [
		frag(),
		null,
		new Map,
		[updates, update],
		[destructors, destruct],
	]));
};

const parent$ = ([root, ...rest]) => [parent(root), ...rest];
const put = (...pipes) => pipe(...pipes, parent$);

const test = (val, updates, node, fn) =>
	is_function(val)
		? updates.push((data, env) => val(data, env) && fn(val(data, env)))
		: val && fn(val);

export const attr = attr => (val = identity) => exec(([node,,, [updates]]) =>
	test(val, updates, node, value => node.setAttribute(attr, value)));

export const prop = prop => (val = identity) => exec(([node,,, [updates]]) =>
	test(val, updates, node, value => node[prop] = value));

export const klass_toggle = value => condition => exec(([node,,, [updates]]) => {
	updates.push((data, env) => {
		node.classList.toggle(value, condition(data, env));
	});
});

export const factory = tag => (creator => (...pipes) => put(creator, ...pipes))(create(tag));
export const div = factory('div');
export const input = factory('input');
export const button = factory('button');
export const textarea = factory('textarea');

export const attach = (node, event, listener) => (
	dom_on(node, event, listener),
	() => dom_off(node, event, listener));

export const ref = key => exec(([node,, refs]) => refs.set(key, node));
export const on = event => listener => exec(([node,,, [, update, env], [destructors]]) => {
	destructors.push(attach(node, event, e => {
		listener(e, update, env);
	}));
});
export const click = on('click');
export const hover = on('hover');

export const type = attr('type');
export const radio = type('radio');
export const name = attr('name');
export const hidden = attr('hidden')('');
export const checked = attr('checked')('');
export const klass = attr('class');
export const id = prop('id');
export const text = prop('textContent');
export const placeholder = prop('placeholder');
export const value = prop('value');

export const list = (getter, creator) => exec(input => {
	const [root,,, [updates, update], [destructors, destruct]] = input;
	const komment = append_child(root, comment());
	const fragment = frag();
	const fragment_tmp = frag();
	const nodes = [];
	const nodes_updates = new WeakMap;
	const nodes_destructors = new WeakMap;
	const env = {};
	let list;

	let graveyard = [];
	const graveyard_updates = new WeakMap;
	const graveyard_destructors = new WeakMap;

	const update_global = patch => updates.forEach(fn => fn({ ...env, ...patch }));

	function nodes_foreach(node, i) {
		nodes_updates.get(node).forEach(event => event(list[i], env));
	}

	function list_foreach(item, i) {
		const [frag,,, [node_updates], [node_destructors]] = creator([
			fragment,
			[item, env],
			null,
			[[], update_global, env, item],
			[[]],
		]);

		// to sie zjebie zaraz bo inne indeksy bede podawal...
		const node = frag.childNodes[i];
		// updates.push(...node_updates);
		nodes.push(node);
		// console.log('node:', node);
		nodes_updates.set(node, node_updates);
		nodes_destructors.set(node, node_destructors);
		node_updates.forEach(event => event(item, env));
	}

	updates.push(env_fresh => {
		const list_test = getter(Object.assign(env, env_fresh));
		if (!is_array(list_test)) {
			console.log('just updating state...', nodes);
			nodes.forEach(nodes_foreach);
			return;
		}

		list = list_test;
		const N = nodes.length;
		const L = list.length;
		if (L === 0) {
			nodes.forEach(remove);
		} else if (N < L) {
			console.log('<');

			const required = list.length - nodes.length;
			const dead = graveyard.length;

			// jest nadmiar starych nodeow
			if (dead >= required) {
				graveyard.slice(0, required).forEach((node, i) => {
					// console.log('dodajemy brakujace nodey', node);
					nodes.push(append_child(fragment, node));
					const updates = graveyard_updates.get(node);
					nodes_updates.set(node, updates)
					updates.forEach(event => event(list[i + required], env));

					nodes_destructors.set(node, graveyard_destructors.get(node));

					graveyard_updates.delete(node);
					graveyard_destructors.delete(node);
				});
				graveyard = graveyard.slice(required);

			// stare nodey nie pokryja calego zapotrzebowania
			// czesc wezmiemy z graveryadu a czesc trzeba dorobic
			} else {
				// console.log(`List: ${L}, Nodes: ${N}, Dead: ${dead}`);
				dead && graveyard.forEach((node, i) => {
					// console.log('dodajemy brakujace nodey (za malo)', node);
					nodes.push(append_child(fragment, node));
					const updates = graveyard_updates.get(node);
					nodes_updates.set(node, updates)
					updates.forEach(event => event(list[i + required], env));

					nodes_destructors.set(node, graveyard_destructors.get(node));

					graveyard_updates.delete(node);
					graveyard_destructors.delete(node);
				});

				list.slice(N + dead).forEach((item, i) => {
					list_foreach(item, i + dead);
					// console.log('nodes:', nodes);
				});

				graveyard.length = 0;
			}

			nodes.forEach(nodes_foreach);
			root.appendChild(fragment);
		} else if (N === L) {
			console.log('=', nodes, list);
			nodes.forEach(nodes_foreach);
		} else if (N > L) {
			console.log('>');
			// nodes.slice(0, list.length);

			// move the excess nodes to the graveyard
			nodes.slice(list.length).forEach(node => {
				node.remove();

				graveyard.push(node);
				graveyard_updates.set(node, nodes_updates.get(node));
				graveyard_destructors.set(node, nodes_destructors.get(node));

				nodes_updates.delete(node);
				nodes_destructors.delete(node);
			});
			nodes.length = list.length;
			nodes.forEach(nodes_foreach);
		}
		append_child(root, fragment);
	});

	destructors.push(() => {
		root.remove();
		nodes_destructors.get(node).forEach(apply);
		graveyard_destructors.get(node).forEach(apply);
		// not sure how much more should I do here
	});
});