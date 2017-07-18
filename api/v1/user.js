import {buildResponse} from "../../util/ajax";
import UserModel from "../../models/user";
import {
    RES_FAILED,
    RES_FAILED_USER_ERR_PWD,
    RES_FAILED_USER_NONE,
    RES_MSG_USER_ERR_PWD,
    RES_MSG_USER_NONE,
    RES_SUCCEED
} from "../../util/status";

/**
 * 登录接口, status == 0 成功返回token; -1000 账号不存在; -1001 密码错误
 * @param req account/password
 * @param res
 */
export function login(req, res) {
    const account = req.query.account;
    const password = req.query.password;
    let status = RES_FAILED;
    let msg = null;
    let token = null;
    let isAdmin = false;
    UserModel.find({
        account: account,
    }, (err, data) => {
        if (data.length === 1) {
            const pwd = data[0].pwd;
            if (pwd === password) {
                status = RES_SUCCEED;
                token = data[0].accessToken;
                isAdmin = data[0].isAdmin;
            } else {
                status = RES_FAILED_USER_ERR_PWD;
                msg = RES_MSG_USER_ERR_PWD;
            }
        } else {
            status = RES_FAILED_USER_NONE;
            msg = RES_MSG_USER_NONE;
        }
        req.session.token = account;
        res.json(buildResponse(status, {token: token, isAdmin: isAdmin}, msg));
    });
}

// 注销
export function logout(req, res, next) {
    res.send('logout ' + req.session.token + ' ' + req.query.account);
}

