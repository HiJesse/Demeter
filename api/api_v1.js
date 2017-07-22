import express from 'express';
import * as user from "./v1/user";

let router = express.Router();

// 登录
router.get('/user/login', user.login);

// 修改密码
router.get('/user/modifyPassword', user.modifyPassword);

// 获取用户信息
router.get('/user/getUserInfo', user.getUserInfo);

export default router;
