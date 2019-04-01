export const $add = (set, item) => (set.add(item), item);
export const $del = (set, item) => (set.delete(item), item);
export const $has = (set, item) => set.has(item);
export const create = () => new Set();
export const toggle = set => val => ((set.has(val) ? set.delete(val) : set.add(val)), set);
