import express from 'express';
import * as user from "./v1/user";

let router = express.Router();

// 登录
router.get('/login', user.login);

// 注销
router.get('/logout', user.logout);

// 修改密码
router.get('/modifyPassword', user.modifyPassword);

export default router;
