export const get = (map, key) => map.get(key);
export const set = (map, key, value) => (map.set(key, value), value);
export const set_reduce = (map, [key, value]) => (set(map, key, value), map);
export const del = (map, key) => map.delete(key);
