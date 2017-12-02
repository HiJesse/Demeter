// user api
import {buildResponse} from "../../util/AjaxUtil";
import UserModel, {
    createUser,
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
    RES_FAILED_NOT_ADMIN,
    RES_FAILED_PARAMS_INVALID,
    RES_FAILED_RESET_PASSWORD,
    RES_FAILED_UPDATE_USER_INFO,
    RES_FAILED_USER_ERR_PWD,
    RES_FAILED_USER_IS_EXIST,
    RES_FAILED_USER_IS_NOT_EXIST,
    RES_FAILED_USER_NONE,
    RES_MSG_CREATE_USER,
    RES_MSG_DELETE_USER,
    RES_MSG_FETCH_USER_LIST,
    RES_MSG_FIND_USER_INFO,
    RES_MSG_LOGIN,
    RES_MSG_MODIFY_PWD,
    RES_MSG_NOT_ADMIN,
    RES_MSG_PARAMS_INVALID,
    RES_MSG_RESET_PASSWORD,
    RES_MSG_UPDATE_USER_INFO,
    RES_MSG_USER_ERR_PWD,
    RES_MSG_USER_IS_EXIST,
    RES_MSG_USER_IS_NOT_EXIST,
    RES_MSG_USER_NONE,
    RES_SUCCEED
} from "../Status";
import {isArrayEmpty, isObjectEmpty, isStringEmpty} from "../../util/CheckerUtil";
import {md5} from "../../util/EncryptUtil";
import {isAdmin, updateUserInfoByIdOrAccount} from "./base/BaseUserApi";
import * as LogUtil from "../../util/LogUtil";
import {createJsonWebToken} from "../../util/WebTokenUtil";

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
        if (isObjectEmpty(err)) {
            status = RES_FAILED_LOGIN;
            msg = RES_FAILED_LOGIN;
        } else if (err.findUserError) {
            status = RES_FAILED_FIND_USER_INFO;
            msg = RES_MSG_FIND_USER_INFO;
        }
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
        if (isObjectEmpty(err)) {
            status = RES_FAILED_MODIFY_PWD;
            msg = RES_MSG_MODIFY_PWD;
        } else if (err.userNotExist) {
            status = RES_FAILED_USER_IS_NOT_EXIST;
            msg = RES_MSG_USER_IS_NOT_EXIST;
        } else if (err.invalidPassword) {
            status = RES_FAILED_USER_ERR_PWD;
            msg = RES_MSG_USER_ERR_PWD;
        } else if (err.saveUserInfoError) {
            status = RES_FAILED_UPDATE_USER_INFO;
            msg = RES_MSG_UPDATE_USER_INFO;
        }
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
        if (isObjectEmpty(err)) {
            status = RES_FAILED_LOGIN;
            msg = RES_FAILED_LOGIN;
        } else if (err.userNotExist) {
            status = RES_FAILED_USER_IS_NOT_EXIST;
            msg = RES_MSG_USER_IS_NOT_EXIST;
        }
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
        if (isObjectEmpty(err)) {
            status = RES_FAILED_UPDATE_USER_INFO;
            msg = RES_MSG_UPDATE_USER_INFO;
        } else if (err.userNotExist) {
            status = RES_FAILED_USER_IS_NOT_EXIST;
            msg = RES_MSG_USER_IS_NOT_EXIST;
        } else if (err.isUserExistError) {
            status = RES_FAILED_FIND_USER_INFO;
            msg = RES_MSG_FIND_USER_INFO;
        }
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
            accessToken: 'tmp',
            createdAt: '2017-11-11'
        })
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '创建成功'));
    }).catch((err) => {
        LogUtil.e(`${TAG} createUser ${JSON.stringify(err)}`);
        if (isObjectEmpty(err)) {
            status = RES_FAILED_CREATE_USER;
            msg = RES_MSG_CREATE_USER;
        } else if (err.isAdminUserError || err.findUserError) {
            status = RES_FAILED_FIND_USER_INFO;
            msg = RES_MSG_FIND_USER_INFO;
        } else if (err.isNotAdmin) {
            status = RES_FAILED_NOT_ADMIN;
            msg = RES_MSG_NOT_ADMIN;
        } else if (err.isUserExist) {
            status = RES_FAILED_USER_IS_EXIST;
            msg = RES_MSG_USER_IS_EXIST;
        }
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
        if (isObjectEmpty(err)) {
            status = RES_FAILED_RESET_PASSWORD;
            msg = RES_MSG_RESET_PASSWORD;
        } else if (err.isAdminUserError) {
            status = RES_FAILED_FIND_USER_INFO;
            msg = RES_MSG_FIND_USER_INFO;
        } else if (err.userNotExist) {
            status = RES_FAILED_USER_IS_NOT_EXIST;
            msg = RES_MSG_USER_IS_NOT_EXIST;
        } else if (err.isNotAdmin) {
            status = RES_FAILED_NOT_ADMIN;
            msg = RES_MSG_NOT_ADMIN;
        } else if (err.saveUserInfoError) {
            status = RES_FAILED_UPDATE_USER_INFO;
            msg = RES_MSG_UPDATE_USER_INFO;
        }
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 根据页码和页面容量获取用户列表
 *
 * 1. 是否为管理员
 * 2. 分页查询
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

    if (isStringEmpty(uId) || isStringEmpty(accountSearch)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    if (pageSize < 0 || pageNum < 0) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_FETCH_USER_LIST;
    let msg = RES_MSG_FETCH_USER_LIST;

    isAdminUser({
        id: uId
    }).then(() => {
        return findUserByPage({}, pageSize, pageNum);
    }).then((allUserInfo) => {
        res.json(buildResponse(RES_SUCCEED, {
            userList: allUserInfo,
            userCount: isArrayEmpty(allUserInfo) ? 0 : allUserInfo.length,
            pageNum: pageNum
        }, '查询成功'));
    }).catch((err) => {
        if (isObjectEmpty(err)) {
            status = RES_FAILED_FETCH_USER_LIST;
            msg = RES_MSG_FETCH_USER_LIST;
        } else if (err.isAdminUserError) {
            status = RES_FAILED_FIND_USER_INFO;
            msg = RES_MSG_FIND_USER_INFO;
        } else if (err.userNotExist) {
            status = RES_FAILED_USER_IS_NOT_EXIST;
            msg = RES_MSG_USER_IS_NOT_EXIST;
        } else if (err.isNotAdmin) {
            status = RES_FAILED_NOT_ADMIN;
            msg = RES_MSG_NOT_ADMIN;
        }
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 删除用户
 * @param req
 * @param res
 */
export const deleteUser = (req, res) => {
    const uId = req.body.uId;
    const account = req.body.account;
    const adminParams = {
        _id: uId
    };

    let status = RES_FAILED_DELETE_USER;
    let msg = RES_MSG_DELETE_USER;


    isAdmin(adminParams).then(() => {
        UserModel.remove({
            account: account
        }, (err) => {
            if (!err) {
                status = RES_SUCCEED;
                msg = null;
            }
            res.json(buildResponse(status, {}, msg));
        });
    }).catch((error) => {
        if (error.isAdmin === false) {
            status = RES_FAILED_NOT_ADMIN;
            msg = RES_MSG_NOT_ADMIN;
        }
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

    let status = RES_FAILED_UPDATE_USER_INFO;
    let msg = RES_MSG_UPDATE_USER_INFO;

    isAdmin({_id: uId}).then(() => {
        return isUserExist({account: account});
    }).then(() => {
        return updateUserInfoByIdOrAccount(null, account, {nickName: nickname})
    }).then(() => {
        status = RES_SUCCEED;
        msg = null;
        res.json(buildResponse(status, {}, msg));
    }).catch((error) => {
        if (isObjectEmpty(error)) {
            status = RES_FAILED_UPDATE_USER_INFO;
            msg = RES_MSG_UPDATE_USER_INFO;
        } else if (error.isAdmin === false) {
            status = RES_FAILED_NOT_ADMIN;
            msg = RES_MSG_NOT_ADMIN;
        } else if (error.isUserExist === false) {
            status = RES_FAILED_USER_NONE;
            msg = RES_MSG_USER_NONE;
        }
        res.json(buildResponse(status, {}, msg));
    });
};