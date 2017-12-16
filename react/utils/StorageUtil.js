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

/**
 * 设置 token
 * @param token
 */
export const setToken = token => localStorage.token = token;

/**
 * 获取 token
 */
export const getToken = () => localStorage.token;

/**
 * 设置管理员
 * @param isAdmin
 */
export const setAdmin = isAdmin => localStorage.isAdmin = isAdmin;

/**
 * 获取是否为管理员
 */
export const isAdmin = () => localStorage.isAdmin === 'true';