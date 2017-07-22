const URL_DOMAIN = 'http://localhost:3000/';
const URL_VERSION = 'api/v1/';

const URL_MODULE = {
    USER: 'user/'
};

// 登录
export const URL_LOGIN = URL_DOMAIN + URL_VERSION + URL_MODULE.USER + 'login';
// 注销
export const URL_LOGOUT = URL_DOMAIN + URL_VERSION + URL_MODULE.USER + 'logout';
// 修改密码
export const URL_MODIFY_PWD = URL_DOMAIN + URL_VERSION + URL_MODULE.USER + 'modifyPassword';
// 根据uid获取用户信息
export const URL_GET_USER_INFO = URL_DOMAIN + URL_VERSION + URL_MODULE.USER + 'getUserInfo';