// user api
import {buildResponse} from "../../util/ajax";
import UserModel from "../../models/user";
import {
    RES_FAILED,
    RES_FAILED_COUNT_USER,
    RES_FAILED_CREATE_USER,
    RES_FAILED_FETCH_USER_LIST,
    RES_FAILED_MODIFY_PWD,
    RES_FAILED_NOT_ADMIN,
    RES_FAILED_RESET_PASSWORD,
    RES_FAILED_UPDATE_USER_INFO,
    RES_FAILED_USER_ERR_PWD,
    RES_FAILED_USER_NONE,
    RES_MSG_COUNT_USER,
    RES_MSG_CREATE_USER,
    RES_MSG_FETCH_USER_LIST,
    RES_MSG_MODIFY_PWD,
    RES_MSG_NOT_ADMIN,
    RES_MSG_RESET_PASSWORD,
    RES_MSG_UPDATE_USER_INFO,
    RES_MSG_USER_ERR_PWD,
    RES_MSG_USER_NONE,
    RES_MSG_USER_NONE_PWD,
    RES_SUCCEED
} from "../../util/status";
import {createJsonWebToken} from "../../util/webToken";
import {isArrayEmpty, isStringEmpty} from "../../util/checker";
import {md5} from "../../util/encrypt";

/**
 * 验证账号密码是否存在, 并返回不同状态, 兼容根据uId和account查询
 * @param isLogin 是否登录, true account, false uId
 * @param account | uId
 * @param password
 * @param callback
 */
function verifyUser(isLogin, account, password, callback) {
    let status = RES_FAILED;
    let msg = null;
    let userData = {};
    const params = {};
    if (isLogin) {
        params._id = account;
    } else {
        params.account = account;
    }

    UserModel.find(params, (err, data) => {
        if (data.length === 1) {
            const pwd = data[0].pwd;
            if (pwd === password) {
                status = RES_SUCCEED;
                userData = data[0];
            } else {
                status = RES_FAILED_USER_ERR_PWD;
                msg = RES_MSG_USER_ERR_PWD;
            }
        } else {
            status = RES_FAILED_USER_NONE;
            msg = isLogin ? RES_MSG_USER_NONE_PWD : RES_MSG_USER_NONE;
        }

        callback({
            status: status,
            msg: msg,
            data: userData
        })
    });
}

/**
 * 根据params参数判读该用户是否存在
 * @param params
 * @returns {Promise}
 */
function isUserExist(params) {
    return new Promise((resolve, reject) => {
        UserModel.find(params, (err, data) => {
            if (data.length === 1) {
                resolve({isUserExist: true});
            } else {
                reject({isUserExist: false});
            }
        });
    });
}

/**
 * 根据params参数判断该用户是否为管理员
 * @param params
 * @returns {Promise}
 */
function isAdmin(params) {
    return new Promise((resolve, reject) => {
        UserModel.find(params, (err, data) => {
            if (!isArrayEmpty(data) && data.length === 1 && data[0].isAdmin) {
                resolve({isAdmin: true});
            } else {
                reject({isAdmin: false});
            }
        });
    });
}

/**
 * 获取所有用户信息
 * @returns {Promise}
 */
function findUsersByPage(pageSize, pageNum) {
    return new Promise((resolve, reject) => {
        const query = UserModel.find({});
        query.skip((pageNum - 1) * pageSize);
        query.limit(pageSize);
        query.exec((err, data) => {
            if (data.length < 1) {
                reject();
                return;
            }

            const allUserInfo = data.map(function (item) {
                return {
                    account: item.account,
                    nickName: item.nickName,
                    isAdmin: item.isAdmin,
                };
            });
            resolve(allUserInfo);
        });
    });
}

/**
 * 获取用户总数, 失败的话返回-1
 * @returns {Promise}
 */
function countUsers() {
    return new Promise((resolve, reject) => {
        UserModel.count({}, (err, count) => {
            if (err) {
                reject({userCount: -1});
                return;
            }
            resolve({userCount: count});
        });
    });
}

/**
 * 登录接口, status == 0 成功返回token; -1000 账号不存在; -1001 密码错误
 * @param req account/password
 * @param res
 */
export function login(req, res) {
    const account = req.body.account;
    const password = req.body.password;
    verifyUser(false, account, password, (val) => {
        const data = val.data;
        res.json(buildResponse(val.status, {
            token: createJsonWebToken(data._id),
            isAdmin: data.isAdmin,
            uId: data._id
        }, val.msg));
    });
}

/**
 * 修改密码接口, 兼容未登录模式和登录模式
 * @param req (account | uId)/password/newPassword
 * @param res
 */
export function modifyPassword(req, res) {
    let isLogin = false;
    let account = req.body.account;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    let updateParams = {pwd: password};

    if (isStringEmpty(account)) {
        account = req.body.uId;
        updateParams._id = account;
        isLogin = true;
    } else {
        updateParams.account = account;
    }

    verifyUser(isLogin, account, password, (val) => {
        if (val.status !== RES_SUCCEED) {
            res.json(buildResponse(val.status, {}, val.msg));
            return;
        }

        let status = RES_FAILED_MODIFY_PWD;
        let msg = RES_MSG_MODIFY_PWD;

        UserModel.update(updateParams, {
            $set: {pwd: newPassword}
        }, {upsert: true}, (error) => {
            if (!error) {
                status = RES_SUCCEED;
                msg = null;
            }
            res.json(buildResponse(status, {}, msg));
        });
    });
}

/**
 * 根据uId获取用户信息
 * @param req
 * @param res
 */
export function getUserInfo(req, res) {
    const uId = req.query.uId;
    let status = RES_FAILED;
    let msg = null;
    let userData = {};

    UserModel.find({
        _id: uId,
    }, (err, data) => {
        if (data.length === 1) {
            status = RES_SUCCEED;
            userData = data[0];
        } else {
            status = RES_FAILED_USER_NONE;
            msg = RES_MSG_USER_NONE;
        }

        res.json(buildResponse(status, {
            nickName: userData.nickName,
            isAdmin: userData.isAdmin,
            account: userData.account
        }, msg));
    });
}

/**
 * 根据uId更新用户基本信息
 * @param req
 * @param res
 */
export function updateUserInfo(req, res) {
    const uId = req.body.uId;
    const nickName = req.body.nickName;

    let status = RES_FAILED_UPDATE_USER_INFO;
    let msg = RES_MSG_UPDATE_USER_INFO;

    UserModel.update({
        _id: uId
    }, {
        $set: {nickName: nickName}
    }, {upsert: true}, (error) => {
        if (!error) {
            status = RES_SUCCEED;
            msg = null;
        }
        res.json(buildResponse(status, {}, msg));
    });
}

/**
 * 根据account创建新用户
 * @param req
 * @param res
 */
export function createUser(req, res) {
    const account = req.body.account;
    const uId = req.body.uId;

    const params = {
        account: account,
        pwd: md5('a123456')
    };
    const adminParams = {
        _id: uId
    };

    let status = RES_FAILED_CREATE_USER;
    let msg = RES_MSG_CREATE_USER;

    isAdmin(adminParams).then(() => {
        UserModel.create(params, (error) => {
            if (!error) {
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
}

/**
 * 根据account重置用户密码
 * @param req
 * @param res
 */
export function resetPassword(req, res) {
    const account = req.body.account;
    const uId = req.body.uId;
    const params = {
        account: account
    };
    const adminParams = {
        _id: uId
    };

    let status = RES_FAILED_RESET_PASSWORD;
    let msg = RES_MSG_RESET_PASSWORD;

    isAdmin(adminParams).then(() => {
        return isUserExist(params);
    }).then(() => {
        UserModel.update(params, {
            $set: {pwd: md5('a123456')}
        }, {upsert: true}, (error) => {
            if (!error) {
                status = RES_SUCCEED;
                msg = null;
            }
            res.json(buildResponse(status, {}, msg));
        });
    }).catch((error) => {
        if (error.isAdmin === false) {
            status = RES_FAILED_NOT_ADMIN;
            msg = RES_MSG_NOT_ADMIN;
        } else if (error.isUserExist === false) {
            status = RES_FAILED_USER_NONE;
            msg = RES_MSG_USER_NONE;
        }
        res.json(buildResponse(status, {}, msg));
    });
}

/**
 * 根据页码和页面容量获取用户列表
 * 先判断uid是否为管理员, 再获取用户总数, 再根据页码信息查询用户列表
 * @param req
 * @param res
 */
export function fetchUserList(req, res) {
    const uId = req.query.uId;
    const pageSize = Number(req.query.pageSize);
    const pageNum = Number(req.query.pageNum);
    let userCount = -1;
    const adminParams = {
        _id: uId
    };

    let status = RES_FAILED_FETCH_USER_LIST;
    let msg = RES_MSG_FETCH_USER_LIST;


    isAdmin(adminParams).then(() => {
        return countUsers();
    }).then((data) => {
        userCount = data.userCount;
        return findUsersByPage(pageSize, pageNum);
    }).then((allUserInfo) => {
        status = RES_SUCCEED;
        msg = null;
        res.json(buildResponse(status, {
            userList: allUserInfo,
            userCount: userCount,
            pageNum: pageNum
        }, msg));
    }).catch((error) => {
        if (error.isAdmin === false) {
            status = RES_FAILED_NOT_ADMIN;
            msg = RES_MSG_NOT_ADMIN;
        } else if (error.userCount === -1) {
            status = RES_FAILED_COUNT_USER;
            msg = RES_MSG_COUNT_USER;
        }
        res.json(buildResponse(status, {}, msg));
    });
}