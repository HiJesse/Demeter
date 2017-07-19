/**
 * 验证账号密码是否存在, 并返回不同状态
 * @param account
 * @param password
 * @param callback
 */
import {buildResponse} from "../../util/ajax";
import UserModel from "../../models/user";
import {
    RES_FAILED, RES_FAILED_MODIFY_PWD,
    RES_FAILED_USER_ERR_PWD,
    RES_FAILED_USER_NONE, RES_MSG_MODIFY_PWD,
    RES_MSG_USER_ERR_PWD,
    RES_MSG_USER_NONE,
    RES_SUCCEED
} from "../../util/status";

function verifyUser(account, password, callback) {
    let status = RES_FAILED;
    let msg = null;
    let userData = {};

    UserModel.find({
        account: account,
    }, (err, data) => {
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
            msg = RES_MSG_USER_NONE;
        }

        callback({
            status: status,
            msg: msg,
            data: userData
        })
    });
}

/**
 * 登录接口, status == 0 成功返回token; -1000 账号不存在; -1001 密码错误
 * @param req account/password
 * @param res
 */
export function login(req, res) {
    const account = req.query.account;
    const password = req.query.password;
    verifyUser(account, password, (val) => {
        req.session.token = account;
        const data = val.data;
        res.json(buildResponse(val.status, {token: data.token, isAdmin: data.isAdmin}, val.msg));
    });
}

/**
 * 修改密码接口
 * @param req account/password/newPassword
 * @param res
 */
export function modifyPassword(req, res) {
    const account = req.query.account;
    const password = req.query.password;
    const newPassword = req.query.newPassword;

    verifyUser(account, password, (val) => {
        if (val.status !== RES_SUCCEED) {
            const data = val.data;
            res.json(buildResponse(val.status, {token: data.token, isAdmin: data.isAdmin}, val.msg));
            return;
        }

        let status = RES_FAILED_MODIFY_PWD;
        let msg = RES_MSG_MODIFY_PWD;

        UserModel.update({
            account: account,
            pwd: password
        }, {
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

// 注销
export function logout(req, res, next) {
    res.send('logout ' + req.session.token + ' ' + req.query.account);
}

