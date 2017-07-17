const crypto = require('crypto');


/**
 * 生成md5结果
 * @param value 字符串
 * @returns {*}
 */
export function md5(value) {
    const hash = crypto.createHash('md5');
    hash.update(value);
    return hash.digest('hex');
}