// user api
import {buildResponse} from "../../util/ajax";
import UserModel from "../../models/user";
import {
    RES_FAILED,
    RES_FAILED_COUNT_USER,
    RES_FAILED_CREATE_USER,
    RES_FAILED_DELETE_USER,
    RES_FAILED_FETCH_USER_LIST,
    RES_FAILED_MATCHED_USER_LIST,
    RES_FAILED_MODIFY_PWD,
    RES_FAILED_NOT_ADMIN,
    RES_FAILED_RESET_PASSWORD,
    RES_FAILED_UPDATE_USER_INFO,
    RES_FAILED_USER_NONE,
    RES_MSG_COUNT_USER,
    RES_MSG_CREATE_USER,
    RES_MSG_DELETE_USER,
    RES_MSG_FETCH_USER_LIST,
    RES_MSG_MATCHED_USER_LIST,
    RES_MSG_MODIFY_PWD,
    RES_MSG_NOT_ADMIN,
    RES_MSG_RESET_PASSWORD,
    RES_MSG_UPDATE_USER_INFO,
    RES_MSG_USER_NONE,
    RES_SUCCEED
} from "../../util/status";
import {createJsonWebToken} from "../../util/webToken";
import {isObjectEmpty, isStringEmpty} from "../../util/checker";
import {md5} from "../../util/encrypt";
import {
    countUsers,
    findUsersByPage,
    isAdmin,
    isUserExist,
    updateUserInfoByIdOrAccount,
    verifyUser
} from "./base/baseUserApi";

/**
 * 登录接口, status == 0 成功返回token; -1000 账号不存在; -1001 密码错误
 * @param req account/password
 * @param res
 */
export const login = (req, res) => {
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
};

/**
 * 修改密码接口, 兼容未登录模式和登录模式
 * @param req (account | uId)/password/newPassword
 * @param res
 */
export const modifyPassword = (req, res) => {
    let isLogin = false;
    let account = req.body.account;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const updateParams = {pwd: password};

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
};

/**
 * 根据uId获取用户信息
 * @param req
 * @param res
 */
export const getUserInfo = (req, res) => {
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
};

/**
 * 根据uId更新用户基本信息
 * @param req
 * @param res
 */
export const updateUserInfo = (req, res) => {
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
};

/**
 * 根据account创建新用户
 * @param req
 * @param res
 */
export const createUser = (req, res) => {
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
};

/**
 * 根据account重置用户密码
 * @param req
 * @param res
 */
export const resetPassword = (req, res) => {
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
};

/**
 * 根据页码和页面容量获取用户列表
 * 先判断uid是否为管理员, 再获取用户总数, 再根据页码信息查询用户列表
 * @param req
 * @param res
 */
export const fetchUserList = (req, res) => {
    const uId = req.query.uId;
    const pageSize = Number(req.query.pageSize);
    const pageNum = Number(req.query.pageNum);
    const accountSearch = req.query.accountSearch;
    let userCount = -1;
    const adminParams = {
        _id: uId
    };

    let status = RES_FAILED_FETCH_USER_LIST;
    let msg = RES_MSG_FETCH_USER_LIST;


    isAdmin(adminParams).then(() => {
        return countUsers(accountSearch);
    }).then((data) => {
        userCount = data.userCount;
        return findUsersByPage(pageSize, pageNum, accountSearch);
    }).then((allUserInfo) => {
        status = RES_SUCCEED;
        msg = null;
        res.json(buildResponse(status, {
            userList: allUserInfo,
            userCount: userCount,
            pageNum: pageNum
        }, msg));
    }).catch((error) => {
        if (isObjectEmpty(error)) {
            status = RES_FAILED_FETCH_USER_LIST;
            msg = RES_MSG_FETCH_USER_LIST;
        } else if (error.isAdmin === false) {
            status = RES_FAILED_NOT_ADMIN;
            msg = RES_MSG_NOT_ADMIN;
        } else if (error.userCount === -1) {
            status = RES_FAILED_COUNT_USER;
            msg = RES_MSG_COUNT_USER;
        } else if (error.hasMatchedUser === false) {
            status = RES_FAILED_MATCHED_USER_LIST;
            msg = RES_MSG_MATCHED_USER_LIST;
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