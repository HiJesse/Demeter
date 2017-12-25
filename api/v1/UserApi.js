// user api
import {buildResponse} from "../../util/AjaxUtil";
import orm from "orm";
import {
    countUser,
    createUser,
    deleteUser,
    findUser,
    findUserByPage,
    isAdminUser,
    isUserExist,
    saveUserInfo
} from "../../models/UserModel";
import {
    RES_FAILED_CREATE_USER,
    RES_FAILED_DELETE_USER,
    RES_FAILED_FETCH_USER_LIST,
    RES_FAILED_FIND_USER_INFO,
    RES_FAILED_LOGIN,
    RES_FAILED_MODIFY_PWD,
    RES_FAILED_PARAMS_INVALID,
    RES_FAILED_RESET_PASSWORD,
    RES_FAILED_UPDATE_USER_INFO,
    RES_FAILED_USER_ERR_PWD,
    RES_FAILED_USER_NONE,
    RES_MSG_CREATE_USER,
    RES_MSG_DELETE_USER,
    RES_MSG_FETCH_USER_LIST,
    RES_MSG_FIND_USER_INFO,
    RES_MSG_LOGIN,
    RES_MSG_MODIFY_PWD,
    RES_MSG_PARAMS_INVALID,
    RES_MSG_RESET_PASSWORD,
    RES_MSG_UPDATE_USER_INFO,
    RES_MSG_USER_ERR_PWD,
    RES_MSG_USER_NONE,
    RES_SUCCEED
} from "../status/Status";
import {isArrayEmpty, isNumberInvalid, isStringEmpty} from "../../util/CheckerUtil";
import {md5} from "../../util/EncryptUtil";
import * as LogUtil from "../../util/LogUtil";
import {createJsonWebToken} from "../../util/WebTokenUtil";
import {getFullDate} from "../../util/TimeUtil";
import {buildUserErrorStatus} from "../status/UserErrorMapping";

const TAG = 'UserApi';

/**
 * 登录接口
 *
 * 1. 参数校验
 * 2. 查找用户
 * 3. 判断密码
 *
 * @param req account/password
 * @param res
 */
export const login = (req, res) => {
    const account = req.body.account;
    const password = req.body.password;

    let status = RES_FAILED_LOGIN;
    let msg = RES_MSG_LOGIN;

    LogUtil.i(`${TAG} login ${account}`);

    if (isStringEmpty(account) || isStringEmpty(password)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    findUser({
        account: account,
    }).then(results => {
        handleLoginResult(req, res, results);
    }).catch(err => {
        LogUtil.e(`${TAG} login ${JSON.stringify(err)}`);
        [status, msg] = buildUserErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 处理登录信息结果
 * @param req
 * @param res
 * @param results
 */
const handleLoginResult = (req, res, results) => {
    if (isArrayEmpty(results)) {
        res.json(buildResponse(RES_FAILED_USER_NONE, {}, RES_MSG_USER_NONE));
        return;
    }

    const result = results[0];

    if (result.pwd !== req.body.password) {
        res.json(buildResponse(RES_FAILED_USER_ERR_PWD, {}, RES_MSG_USER_ERR_PWD));
        return;
    }

    res.json(buildResponse(RES_SUCCEED, {
        token: createJsonWebToken(result.id),
        isAdmin: result.admin,
        uId: result.id
    }, '登录成功'));
};

/**
 * 修改密码
 *
 * 兼容登录和非登录, 登录使用uId 非登录使用account
 *
 * 1. 判断用户是否存在
 * 2. 判断用户密码是否正确
 * 3. 保存用户新密码
 *
 * @param req
 * @param res
 */
export const modifyPassword = (req, res) => {
    const account = req.body.account;
    const uId = req.body.uId;
    const password = req.body.password;
    const newPassword = req.body.newPassword;

    LogUtil.i(`${TAG} modifyPassword ${account} ${uId}`);

    // 密码校验
    if (isStringEmpty(password) || isStringEmpty(newPassword)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let userParams = {};

    // 用户标识校验
    if (isStringEmpty(account) && isStringEmpty(uId)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    } else if (isStringEmpty(account)) {
        userParams.id = uId;
    } else {
        userParams.account = account;
    }

    let status = RES_FAILED_MODIFY_PWD;
    let msg = RES_MSG_MODIFY_PWD;

    isUserExist(userParams).then(result => {
        if (result.pwd !== password) { // 如果密码不匹配 则结束
            throw {invalidPassword: true};
        }
        result.pwd = newPassword;
        return saveUserInfo(result);
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '密码修改成功'));
    }).catch(err => {
        LogUtil.e(`${TAG} modifyPassword ${JSON.stringify(err)}`);
        [status, msg] = buildUserErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 根据uId获取用户信息
 *
 * 1. 判断用户是否存在
 * 2. 返回用户信息
 *
 * @param req
 * @param res
 */
export const getUserInfo = (req, res) => {
    const uId = req.query.uId;

    LogUtil.i(`${TAG} getUserInfo ${uId}`);

    if (isStringEmpty(uId)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_FIND_USER_INFO;
    let msg = RES_MSG_FIND_USER_INFO;

    isUserExist({
        id: uId,
    }).then(result => {
        res.json(buildResponse(RES_SUCCEED, {
            nickName: result.nickName,
            isAdmin: result.admin,
            account: result.account
        }, msg));
    }).catch(err => {
        LogUtil.e(`${TAG} getUserInfo ${JSON.stringify(err)}`);
        [status, msg] = buildUserErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 根据uId更新用户基本信息
 *
 * 1. uId用户是否存在
 * 2. 更新昵称
 *
 * @param req
 * @param res
 */
export const updateUserInfo = (req, res) => {
    const uId = req.body.uId;
    const nickName = req.body.nickName;

    LogUtil.i(`${TAG} updateUserInfo ${uId} ${nickName}`);

    if (isStringEmpty(uId) || isStringEmpty(nickName)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_UPDATE_USER_INFO;
    let msg = RES_MSG_UPDATE_USER_INFO;

    isUserExist({
        id: uId,
    }).then(result => {
        result.nickName = nickName;
        return saveUserInfo(result);
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '更新成功'));
    }).catch(err => {
        LogUtil.e(`${TAG} updateUserInfo ${JSON.stringify(err)}`);
        [status, msg] = buildUserErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 根据account创建新用户
 * 1. 校验是否为管理员
 * 2. 校验用户是否存在
 * 3. 创建用户
 * @param req
 * @param res
 */
export const createUserInfo = (req, res) => {
    const account = req.body.account;
    const uId = req.body.uId;

    LogUtil.i(`${TAG} createUser ${uId} ${account}`);

    if (isStringEmpty(uId) || isStringEmpty(account)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_CREATE_USER;
    let msg = RES_MSG_CREATE_USER;

    isAdminUser({
        id: uId
    }).then(() => {
        return findUser({account: account});
    }).then((results) => {
        if (!isArrayEmpty(results)) {
            throw {isUserExist: true}; // 用户已经存在
        }
        return createUser({
            account: account,
            pwd: md5('a123456'),
            admin: false,
            createdAt: getFullDate(),
        })
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '创建成功'));
    }).catch((err) => {
        LogUtil.e(`${TAG} createUser ${JSON.stringify(err)}`);
        [status, msg] = buildUserErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 根据account重置用户密码
 *
 * 1. 权限校验
 * 2. 校验被重置用户是否存在
 * 3. 重置用户密码
 *
 * @param req
 * @param res
 */
export const resetPassword = (req, res) => {
    const account = req.body.account;
    const uId = req.body.uId;

    LogUtil.i(`${TAG} resetPassword ${uId} ${account}`);

    if (isStringEmpty(uId) || isStringEmpty(account)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_RESET_PASSWORD;
    let msg = RES_MSG_RESET_PASSWORD;

    isAdminUser({
        id: uId
    }).then(() => {
        return isUserExist({account: account});
    }).then((result) => {
        result.pwd = md5('a123456');
        return saveUserInfo(result);
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '重置成功'));
    }).catch((err) => {
        LogUtil.e(`${TAG} resetPassword ${JSON.stringify(err)}`);
        [status, msg] = buildUserErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 根据页码和页面容量获取用户列表
 *
 * 1. 是否为管理员
 * 2. 计算用户总数
 * 3. 分页查询
 *
 * @param req
 * @param res
 */
export const fetchUserList = (req, res) => {
    const uId = req.query.uId;
    const pageSize = Number(req.query.pageSize);
    const pageNum = Number(req.query.pageNum);
    const accountSearch = req.query.accountSearch;

    LogUtil.i(`${TAG} fetchUserList ${uId} ${accountSearch} ${pageNum}`);

    if (isStringEmpty(uId) || !isNumberInvalid(pageSize) || !isNumberInvalid(pageNum)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_FETCH_USER_LIST;
    let msg = RES_MSG_FETCH_USER_LIST;
    let userCount = 0;

    const accountLike = isStringEmpty(accountSearch) || accountSearch === 'null' ? '%' : '%' + accountSearch + '%';

    isAdminUser({
        id: uId
    }).then(() => {
        return countUser({account: orm.like(accountLike)});
    }).then((count) => {
        userCount = count;
        return findUserByPage({account: orm.like(accountLike)}, pageSize, pageNum);
    }).then((allUserInfo) => {
        res.json(buildResponse(RES_SUCCEED, {
            userList: allUserInfo,
            userCount: userCount,
            pageNum: pageNum
        }, '查询成功'));
    }).catch((err) => {
        LogUtil.e(`${TAG} fetchUserList ${JSON.stringify(err)}`);
        [status, msg] = buildUserErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 删除用户
 *
 * 1. 判断管理员权限
 * 2. 禁止删除管理员账户
 * 3. 删除账户
 *
 * @param req
 * @param res
 */
export const deleteUserInfo = (req, res) => {
    const uId = req.body.uId;
    const account = req.body.account;

    LogUtil.i(`${TAG} deleteUser ${uId} ${account}`);

    if (isStringEmpty(uId) || isStringEmpty(account)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_DELETE_USER;
    let msg = RES_MSG_DELETE_USER;


    isAdminUser({
        id: uId
    }).then((result) => {
        // 禁止删除的是管理员账户
        if (result.account === account) {
            throw {isAdminAccount: true}
        }
        return deleteUser({account: account});
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '删除成功'));
    }).catch((err) => {
        LogUtil.e(`${TAG} fetchUserList ${JSON.stringify(err)}`);
        [status, msg] = buildUserErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 根据uId更新用户基本信息
 * 1. 校验admin
 * 2. account用户是否存在
 * 3. 更新用户信息
 * @param req
 * @param res
 */
export const updateUserInfoByAdmin = (req, res) => {
    const uId = req.body.uId;
    const account = req.body.account;
    const nickname = req.body.nickname;

    LogUtil.i(`${TAG} updateUserInfoByAdmin ${uId} ${account} ${nickname}`);

    if (isStringEmpty(uId) || isStringEmpty(account) || isStringEmpty(nickname)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_UPDATE_USER_INFO;
    let msg = RES_MSG_UPDATE_USER_INFO;

    isAdminUser({
        id: uId
    }).then(() => {
        return isUserExist({account: account});
    }).then((result) => {
        result.nickName = nickname;
        return saveUserInfo(result);
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '更新成功'));
    }).catch((err) => {
        LogUtil.e(`${TAG} updateUserInfoByAdmin ${JSON.stringify(err)}`);
        [status, msg] = buildUserErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};