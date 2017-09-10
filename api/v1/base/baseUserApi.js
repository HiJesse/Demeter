// base user api
import UserModel from "../../../models/user";
import {
    RES_FAILED,
    RES_FAILED_USER_ERR_PWD,
    RES_FAILED_USER_NONE,
    RES_MSG_USER_ERR_PWD,
    RES_MSG_USER_NONE,
    RES_MSG_USER_NONE_PWD,
    RES_SUCCEED
} from "../../../util/status";
import {isArrayEmpty, isStringEmpty} from "../../../util/checker";


/**
 * 验证账号密码是否存在, 并返回不同状态, 兼容根据uId和account查询
 * @param isLogin 是否登录, true account, false uId
 * @param account | uId
 * @param password
 * @param callback
 */
export const verifyUser = (isLogin, account, password, callback) => {
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
};

/**
 * 根据params参数判读该用户是否存在
 * @param params
 * @returns {Promise}
 */
export const isUserExist = params => {
    return new Promise((resolve, reject) => {
        UserModel.find(params, (err, data) => {
            if (data.length === 1) {
                resolve({isUserExist: true});
            } else {
                reject({isUserExist: false});
            }
        });
    });
};

/**
 * 根据params参数判断该用户是否为管理员
 * @param params
 * @returns {Promise}
 */
export const isAdmin = params => {
    return new Promise((resolve, reject) => {
        UserModel.find(params, (err, data) => {
            if (!isArrayEmpty(data) && data.length === 1 && data[0].isAdmin) {
                resolve({isAdmin: true});
            } else {
                reject({isAdmin: false});
            }
        });
    });
};

/**
 * 分页获取用户信息, 并支持基于账号的模糊搜索
 * @param pageSize
 * @param pageNum
 * @param accountSearch
 * @returns {Promise}
 */
export const findUsersByPage = (pageSize, pageNum, accountSearch) => {
    const findParams = {};
    if (!isStringEmpty(accountSearch) && accountSearch !== 'null') {
        findParams.account = new RegExp(accountSearch, 'i');
    }

    return new Promise((resolve, reject) => {
        const query = UserModel.find(findParams);
        query.skip((pageNum - 1) * pageSize);
        query.limit(pageSize);
        query.exec((err, data) => {
            if (data.length < 1) {
                reject({hasMatchedUser: false});
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
};

/**
 * 获取根据参数的用户总数, 失败的话返回-1
 * @param accountSearch 模糊查找
 * @returns {Promise}
 */
export const countUsers = (accountSearch) => {
    const findParams = {};
    if (!isStringEmpty(accountSearch) && accountSearch !== 'null') {
        findParams.account = new RegExp(accountSearch, 'i');
    }

    return new Promise((resolve, reject) => {
        UserModel.count(findParams, (err, count) => {
            if (err) {
                reject({userCount: -1});
            }
            resolve({userCount: count});
        });
    });
};

/**
 * 根据参数获取用户列表
 * @param params
 */
export const findUsersByAccounts = params =>
    new Promise((resolve, reject) => {
        UserModel.find({
            account: params
        }, (err, data) => {
            if (err) {
                reject({findUsers: false})
            }
            resolve(data);
        });
    });

/**
 * 更新用户信息 可选根据uId和account进行查询
 * @param uId
 * @param account
 * @param params
 * @returns {Promise}
 */
export const updateUserInfoByIdOrAccount = (uId, account, params) => {
    let findParams = {_id: 'undefined'};
    if (!isStringEmpty(uId)) {
        findParams = {_id: uId};
    } else if (!isStringEmpty(account)) {
        findParams = {account: account}
    }

    return new Promise((resolve, reject) => {
        UserModel.update(findParams, {
            $set: params
        }, {upsert: false}, (error) => {
            if (error) {
                reject({updateUserInfo: false});
            } else {
                resolve({updateUserInfo: true});
            }
        });
    });
};