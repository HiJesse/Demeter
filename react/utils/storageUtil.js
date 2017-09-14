// storage util

/**
 * 获取用户 ID
 */
export const getUID = () => localStorage.uId;

/**
 * 设置用户 ID
 * @param uId
 */
export const setUID = uId => localStorage.uId = uId;
