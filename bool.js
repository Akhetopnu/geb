export const and = ([a, b]) => a && b;
export const not = bool => !bool;
export const complement = fn => val => !fn(val);
