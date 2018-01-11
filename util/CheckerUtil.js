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

// check is array
export const isArray = val => val instanceof Array;

// number invalid checker
export const isNumberInvalid = num => typeof num === 'number' && !isNaN(num);

/**
 * 字符串val的长度是否最少为length
 * @param val
 * @param length
 */
export const isStringLengthLeast = (val, length) => !isStringEmpty(val) && val.length >= length;

/**
 * 判断字符串src中是否包含dist
 * @param src
 * @param dist
 * @returns {boolean}
 */
export const isStringContains = (src, dist) => {
    if (isStringEmpty(src) || isStringEmpty(dist)) {
        return false;
    }
    return src.indexOf(dist) !== -1;
};

/**
 * 获取字符串src中包含dist的次数
 * @param src
 * @param dist
 * @returns {number}
 */
export const getStringMatchNum = (src, dist) => {
    if (isStringEmpty(src) || isStringEmpty(dist)) {
        return 0;
    }

    const regex = new RegExp(dist, 'g');
    const result = src.match(regex);
    return !result ? 0 : result.length;
};