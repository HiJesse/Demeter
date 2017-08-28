// 成功
export const RES_SUCCEED = 0;
// 失败
export const RES_FAILED = -1;
// 没有token无效
export const RES_FAILED_TOKEN = -2;
export const RES_MSG_TOKEN = '请先登录';

// 是否是管理员
export const RES_FAILED_NOT_ADMIN = 100;
export const RES_MSG_NOT_ADMIN = '权限不足';
// 账号不存在
export const RES_FAILED_USER_NONE = 1000;
export const RES_MSG_USER_NONE = '账号不存在';
export const RES_MSG_USER_NONE_PWD = '旧密码不正确';
// 账号或密码不存在
export const RES_FAILED_USER_ERR_PWD = 1001;
export const RES_MSG_USER_ERR_PWD = '账号或密码不正确';
// 修改密码失败
export const RES_FAILED_MODIFY_PWD = 1002;
export const RES_MSG_MODIFY_PWD = '修改密码失败';
// 用户基本信息修改失败
export const RES_FAILED_UPDATE_USER_INFO = 1003;
export const RES_MSG_UPDATE_USER_INFO = '用户信息更新失败';
// 创建用户失败
export const RES_FAILED_CREATE_USER = 1004;
export const RES_MSG_CREATE_USER = '创建用户失败';
// 重置密码失败
export const RES_FAILED_RESET_PASSWORD = 1005;
export const RES_MSG_RESET_PASSWORD = '重置密码失败';
// 获取用户列表失败
export const RES_FAILED_FETCH_USER_LIST = 1006;
export const RES_MSG_FETCH_USER_LIST = '获取用户列表失败';
// 查询用户总数失败
export const RES_FAILED_COUNT_USER = 1007;
export const RES_MSG_COUNT_USER = '查询用户总数失败';
// 删除用户失败
export const RES_FAILED_DELETE_USER = 1008;
export const RES_MSG_DELETE_USER = '删除用户失败';
// 查询用户总数失败
export const RES_FAILED_MATCHED_USER_LIST = 1009;
export const RES_MSG_MATCHED_USER_LIST = '没有查询到满足条件的用户列表';

// 创建项目失败
export const RES_FAILED_CREATE_PROJECT = 2000;
export const RES_MSG_CREATE_PROJECT = '创建项目失败';
// 项目不存在
export const RES_FAILED_PROJECT_NOT_EXIST = 2001;
export const RES_MSG_PROJECT_NOT_EXIST = '项目不存在';
// 平台不存在
export const RES_FAILED_PLATFORM_NOT_EXIST = 2002;
export const RES_MSG_PLATFORM_NOT_EXIST = '平台不存在';
// 创建项目平台信息失败
export const RES_FAILED_CREATE_PROJECT_PLATFORMS = 2003;
export const RES_MSG_CREATE_PROJECT_PLATFORMS = '创建项目平台信息失败';
// 删除项目失败
export const RES_FAILED_DELETE_PROJECT = 2004;
export const RES_MSG_DELETE_PROJECT = '删除项目失败';
// 删除项目平台信息失败
export const RES_FAILED_DELETE_PROJECT_PLATFORMS = 2005;
export const RES_MSG_DELETE_PROJECT_PLATFORMS = '删除项目平台信息失败';
// 获取项目列表失败
export const RES_FAILED_FETCH_PROJECT_LIST = 2006;
export const RES_MSG_FETCH_PROJECT_LIST = '获取项目列表失败';
// 查询项目总数失败
export const RES_FAILED_COUNT_PROJECT = 2007;
export const RES_MSG_COUNT_PROJECT = '查询项目总数失败';
// 查询项目总数失败
export const RES_FAILED_FETCH_PROJECT_PLATFORM = 2008;
export const RES_MSG_FETCH_PROJECT_PLATFORM = '查询项目平台信息失败';
// 查询项目总数为0
export const RES_FAILED_COUNT_PROJECT_EMPTY = 2009;
export const RES_MSG_COUNT_PROJECT_EMPTY = '未查询到相关项目';
// 更新项目信息失败
export const RES_FAILED_UPDATE_PROJECT_INFO = 2010;
export const RES_MSG_UPDATE_PROJECT_INFO = '更新项目信息失败';
// 更新项目信息失败
export const RES_FAILED_UPDATE_PROJECT_DES = 2011;
export const RES_MSG_UPDATE_PROJECT_DES = '项目描述不能低于三个字符';