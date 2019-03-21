const OBJECT = Object;

export const create = (proto = null) => OBJECT.create(proto);
export const ensure = (obj, prop) => obj[prop] || (obj[prop] = create());
export const { assign, freeze, keys, seal, values } = OBJECT;
