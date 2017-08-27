// string empty checker
export function isStringEmpty(val) {
    return val === undefined || val === null || val === '';
}

// object empty checker
export function isObjectEmpty(val) {
    return val === undefined || val === null || val === {};
}

// array empty checker
export function isArrayEmpty(val) {
    return val === undefined || val === null || val.length === 0;
}

/**
 * 字符串val的长度是否最少为length
 * @param val
 * @param length
 */
export const isStringLengthLeast = (val, length) => !isStringEmpty(val) && val.length >= length;