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