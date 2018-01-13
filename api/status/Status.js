// 成功
export const RES_SUCCEED = 0;
// 失败
export const RES_FAILED = -1;
// catch异常
export const RES_FAILED_EX = -2;
export const RES_MSG_EX = '服务器异常, 请稍后重试';
// 没有token无效
export const RES_FAILED_TOKEN = -3;
export const RES_MSG_TOKEN = '请先登录';
// 参数不合法
export const RES_FAILED_PARAMS_INVALID = -4;
export const RES_MSG_PARAMS_INVALID = '请求参数不合法';

//------------用户

// 是否是管理员
export const RES_FAILED_NOT_ADMIN = 100;
export const RES_MSG_NOT_ADMIN = '权限不足';
// 账号不存在
export const RES_FAILED_USER_NONE = 1000;
export const RES_MSG_USER_NONE = '账号不存在';
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
// 查询用户信息失败
export const RES_FAILED_FIND_USER_INFO = 1010;
export const RES_MSG_FIND_USER_INFO = '查询用户信息失败';
// 账号不存在
export const RES_FAILED_USER_IS_EXIST = 1011;
export const RES_MSG_USER_IS_EXIST = '账号已经存在';
// 登录失败
export const RES_FAILED_LOGIN = 1012;
export const RES_MSG_LOGIN = '登录失败';
// 用户信息不存在
export const RES_FAILED_USER_IS_NOT_EXIST = 1013;
export const RES_MSG_USER_IS_NOT_EXIST = '用户不存在';

//------------项目

// 创建项目失败
export const RES_FAILED_CREATE_PROJECT = 2000;
export const RES_MSG_CREATE_PROJECT = '创建项目失败';
// 项目不存在
export const RES_FAILED_PROJECT_NOT_EXIST = 2001;
export const RES_MSG_PROJECT_NOT_EXIST = '项目不存在';
// 查询项目失败
export const RES_FAILED_FETCH_PROJECT = 2002;
export const RES_MSG_FETCH_PROJECT = '查询项目失败';
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
export const RES_FAILED_COUNT_PROJECT_PLATFORM = 2011;
export const RES_MSG_COUNT_PROJECT_PLATFORM = '未查询到项目平台';
// 添加项目成员失败
export const RES_FAILED_PROJECT_ADD_MEMBER = 2012;
export const RES_MSG_PROJECT_ADD_MEMBER = '添加项目成员失败';
// 用户已经加入该项目
export const RES_FAILED_USER_JOINED_PROJECT = 2013;
export const RES_MSG_USER_JOINED_PROJECT = '用户已经加入该项目';
// 查询项目成员列表失败
export const RES_FAILED_FETCH_PROJECT_MEMBERS = 2014;
export const RES_MSG_FETCH_PROJECT_MEMBERS = '查询项目成员失败';
// 查询项目成员总数失败
export const RES_FAILED_COUNT_PROJECT_MEMBERS = 2015;
export const RES_MSG_COUNT_PROJECT_MEMBERS = '查询项目成员总数失败';
// 删除项目成员失败
export const RES_FAILED_DELETE_PROJECT_MEMBER = 2016;
export const RES_MSG_DELETE_PROJECT_MEMBER = '删除项目成员失败';
// 该成员还没有加入项目
export const RES_FAILED_USER_NOT_JOINED_PROJECT = 2017;
export const RES_MSG_USER_NOT_JOINED_PROJECT = '用户还没有加入该项目';
// 项目已存在
export const RES_FAILED_PROJECT_IS_EXIST = 2018;
export const RES_MSG_PROJECT_IS_EXIST = '项目已存在';
// 删除项目所有成员失败
export const RES_FAILED_DELETE_PROJECT_ALL_MEMBERS = 2019;
export const RES_MSG_DELETE_PROJECT_ALL_MEMBERS = '删除项目所有成员失败';
// 退出项目失败
export const RES_FAILED_QUIT_PROJECT = 2020;
export const RES_MSG_QUIT_PROJECT = '退出项目失败';

//------------dashboard

// 获取dashboard信息失败
export const RES_FAILED_FETCH_DASHBOARD = 3000;
export const RES_MSG_FETCH_DASHBOARD = '获取仪表盘信息失败';

//------------archive

// 上传 archive 失败
export const RES_FAILED_UPLOAD_ARCHIVE = 4000;
export const RES_MSG_UPLOAD_ARCHIVE = '上传文档失败';
// 获取文档列表失败
export const RES_FAILED_FETCH_ARCHIVE = 4001;
export const RES_MSG_FETCH_ARCHIVE = '获取文档列表列表失败';
// 合并项目和文档信息失败
export const RES_FAILED_CONCAT_ARCHIVE_PROJECT = 4002;
export const RES_MSG_CONCAT_ARCHIVE_PROJECT = '合并文档信息失败';
// 删除文档信息失败
export const RES_FAILED_DELETE_ARCHIVE = 4003;
export const RES_MSG_DELETE_ARCHIVE = '删除文档信息失败';
// 查询文档信息失败
export const RES_FAILED_FETCH_ARCHIVES = 4004;
export const RES_MSG_FETCH_ARCHIVES = '查询文档信息失败';
// 查询文档信息失败
export const RES_FAILED_ARCHIVE_NOT_EXIST = 4005;
export const RES_MSG_ARCHIVE_NOT_EXIST = '文档不存在';
// 查询文档总数失败
export const RES_FAILED_COUNT_ARCHIVE = 4006;
export const RES_MSG_COUNT_ARCHIVE = '查询文档总数失败';
// 解析ipa失败
export const RES_FAILED_PARSE_IOS_IPA_ERROR = 4007;
export const RES_MSG_PARSE_IOS_IPA_ERROR = '解析IPA文件失败';
// 上传 OTA plist失败
export const RES_FAILED_UPLOAD_OTA_PLIST_ERROR = 4008;
export const RES_MSG_UPLOAD_OTA_PLIST_ERROR = '上传OTA plist失败';