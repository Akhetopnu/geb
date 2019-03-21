import { length } from './array';
import { not } from './bool';
import { pipe } from './function';

export const exec = fn => (a) => (fn(a), a);
const exec_2 = fn => (a, b) => (fn(a, b), a);
const exec_3 = fn => (a, b, c) => (fn(a, b, c), a);

// ACTIONS
export const when_trusted = event => [event].filter(ev => ev.isTrusted);
export const show = exec(node => node.hidden = false);
export const hide = exec(node => node.hidden = true);
export const enable = exec(node => node.disabled = false);
export const disable = exec(node => node.disabled = true);
export const select = exec(node => node.selected = true);
export const selected = node => node.selected;
export const deselect = exec(node => node.selected = false);
export const value = node => node.value;
export const before = node => node.previousElementSibling;
export const after = node => node.nextElementSibling;
export const remove = exec(node => node.remove());
export const get = id => document.getElementById(id);
export const get_factory = root => id => root.getElementById(id);
export const get_from = (id, root) => root.getElementById(id);
export const prevent = exec(event => event.preventDefault());
export const stop = exec(event => event.stopPropagation());
export const check_toggle = exec(node => node.checked = !node.checked);
export const check = exec(node => node.checked = true);
export const uncheck = exec(node => node.checked = false);
export const query = (root, selector) => root.querySelector(selector);
export const query_all = (root, selector) => root.querySelectorAll(selector);
export const clone_deep = node => node.cloneNode(true);
export const clone_shallow = exec(node => node.cloneNode(false));
export const attr_remove = exec_2((node, attr) => node.removeAttribute(attr));
export const attr_remove_id = exec(node => attr_remove(node, 'id'));

// this will still read live data from HTML, hmm...
export const template_factory = id => (template => {
	const pool = [];
	const create = () => clone_deep(template);
	const take = () => pool.shift() || create();
	const give = val => pool.push(val);

	return val => val ? give(remove(val)) : take();
})(get(id).content);

// CONSTRUCTORS
export const elem = tag => document.createElement(tag);
export const frag = () => document.createDocumentFragment();
export const textnode = str => document.createTextNode(str);

export const append_child = (node, kid) => node.appendChild(kid);
export const append_child$ = child => parent => append_child(parent, child);
export const $append_child = parent => child => append_child(parent, child);
export const append = exec_2((node, kid) => append_child(node, kid));
export const append_child_list = (node, ...kids) => kids.reduce(append, node);
export const insert_before = (parent, node_new, node_old) => parent.insertBefore(node_new, node_old);

// GETTERS / TRANSFORMERS
export const content = node => node.content;
export const target = node => node.target;
export const target_current = node => node.currentTarget;
export const parent = node => node.parentNode;
export const child = node => node.firstElementChild;
export const children = node => node.children;
export const children_nodes = node => [...node.childNodes];
export const id = node => node.id;
export const classlist = node => node.classList;
export const class_has = (node, str) => classlist(node).contains(str);
export const attr = (node, attr) => node.getAttribute(attr);
export const data = node => node.dataset;
export const data_id = node => data(node).id;
export const text_content = node => node.textContent;
export const text_inner = node => node.innerText;
export const html_inner = node => node.innerHTML;
export const label = node => node.label;
export const hidden = node => node.hidden;
export const is_not_hidden = pipe(hidden, not);
export const options = node => [...node.options];
export const options_selected = node => [...node.selectedOptions];
export const options_selected_visible = node => options_selected(node).filter(is_not_hidden);
// export const options_selected_visible = pipe(options_selected, filter(is_not_hidden));
export const options_selected_visible_len = pipe(options_selected_visible, length);
export const item_named = node => val => node.namedItem(val);
export const name = node => node.name;

export const class_on = exec_2((node, classname) => classlist(node).add(classname));
export const class_off = exec_2((node, classname) => classlist(node).remove(classname));
export const class_toggle = exec_2((node, classname) => classlist(node).toggle(classname));

// SETTERS
export const data_id$ = exec_2((node, val) => data(node).id = val);

export const data_equals_factory = prop => val => node => data(node)[prop] === val;
export const data_id_equals = data_equals_factory('id');
export const node_type_equals_factory = type => node => node.nodeType === type;

export const id$ = exec_2((node, id) => node.id = id);
// export const class$ = exec_2((node, classname) => node.className = classname);

export const text$ = exec_2((node, text) => node.textContent = text);
export const text_inner$ = exec_2((node, text = '') => node.innerText = text);
export const html$ = exec_2((node, html) => node.innerHTML = html);
export const value$ = exec_2((node, value) => node.value = value);
export const value_set = val => node => node.value = val;
export const value_clear = value_set('');

const trust = listener => event => listener(when_trusted(event), event);
export const on = (node, event, listener, config) => {
	node.addEventListener(event, ev => {
		// prevent(ev);
		// stop(ev);
		// console.time('a');
		trust(listener)(ev);
		// console.timeEnd('a');
	}, config);
	return node;
};
export const off = (node, event, listener) => (node && (node.removeEventListener(event, listener)), node);

export const on_click = (node, listener, config) => on(node, 'click', listener, config);
export const on_change = (node, listener, config) => on(node, 'change', listener, config);
export const on_input = (node, listener, config) => on(node, 'input', listener, config);

export const off_click = (node, listener) => off(node, 'click', listener);
export const off_change = (node, listener) => off(node, 'change', listener);
export const off_input = (node, listener) => off(node, 'input', listener);

export const on_with_key = key => (node, event, listener, config) => on(node, event, (evs, ev) => (ev.key === key) && (listener(ev)), config);

// const exec = fn => val => (fn(val), val);
// const exec_checked = fn => val => (fn(val), val);
// const prevent = exec(event => event.preventDefault());

// export const $prevent = exec(event => event.preventDefault());

export const $is_tag_factory = tag => node => node.tagName === tag;
export const is_label = $is_tag_factory('LABEL');

// eslint-disable-next-line
export const if_type_then_factory = tag => (node, fn) => node.tagName === tag ? fn(node) : undefined;
export const if_label_then = if_type_then_factory('LABEL');

export const $data_get = (node, prop) => data(node)[prop];
export const $data_get_id_from_event = pipe(target_current, data_id);
export const data$ = exec_3((node, prop, value) => data(node)[prop] = value);

const DIV = elem('div');
const FRAG = frag();
export const html_to_fragment = (() => {
	return html => children_nodes(html$(DIV, html)).reduce(append, FRAG);
})();

export const sandbox = html => children_nodes(html$(DIV, html)).reduce(append, FRAG);
