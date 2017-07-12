
// 注册
export function login(req, res, next) {
    req.session.token = req.query.userId;
    res.send('login ' + req.session.token);
}

// 注销
export function logout(req, res, next) {
    res.send('logout ' + req.session.token);
}

