import { equals, pipe } from './function';
import { has, lower, replace, trim } from './string';
import { hidden, label, options, options_selected, target, text_content, value } from './dom';
import { not } from './bool';

export const apply_fn_to_options_in_list = (nodes, fn) => vals =>
	options(nodes)
		.filter(node => vals.has(value(node)))
		.forEach(fn);

const select_collect_from_event = pipe(target, options_selected);

export const select_collect_values = (fn1, fn2) => event =>
	new Set(select_collect_from_event(event)
		.each(fn1)
		.each(fn2)
		.map(value)
	);

export const name_purify = pipe(trim, lower, replace(/\s+/, ' '));
export const item_name = pipe(target, text_content, name_purify);

export const opt_hidden_decide = name => opt =>
	opt.hidden = !!name && !has(name_purify(text_content(opt)), name);

export const opt_hide_and_collect = select_node => list =>
	options(select_node)
		.each(opt_hidden_decide(list[0]));

export const opt_match_any = ([name, opts]) =>
	!!name && !opts
		.filter(pipe(hidden, not))
		.some(pipe(label, lower, equals(name)));
