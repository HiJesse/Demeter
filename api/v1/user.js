// 注册
import {buildResponse} from "../../util/ajax";
export function login(req, res) {
    const userName = req.query.account;
    const password = req.query.password;

    req.session.token = userName;
    res.json(buildResponse(0, {account: userName, token: 'qwe}{DF,./', isAdmin: false}, null));
}

// 注销
export function logout(req, res, next) {
    res.send('logout ' + req.session.token + ' ' + req.query.account);
}

