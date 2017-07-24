// 成功
export const RES_SUCCEED = 0;
// 失败
export const RES_FAILED = -1;
// 没有token无效
export const RES_FAILED_TOKEN = -2;
export const RES_MSG_TOKEN = '请先登录';


// 账号不存在
export const RES_FAILED_USER_NONE = 1000;
export const RES_MSG_USER_NONE = '账号不存在';
export const RES_MSG_USER_NONE_PWD = '旧密码不正确'; // 通过uId修改密码时使用
// 账号或密码不存在
export const RES_FAILED_USER_ERR_PWD = 1001;
export const RES_MSG_USER_ERR_PWD = '账号或密码不正确';
// 修改密码失败
export const RES_FAILED_MODIFY_PWD = 1002;
export const RES_MSG_MODIFY_PWD = '修改密码失败';