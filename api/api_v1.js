import express from 'express';
import * as user from "./v1/user";

let router = express.Router();

// 登录
router.get('/user/login', user.login);

// 修改密码
router.get('/user/modifyPassword', user.modifyPassword);

// 获取用户信息
router.get('/user/getUserInfo', user.getUserInfo);

// 跟新用户基本信息
router.get('/user/updateGeneralInfo', user.updateUserInfo);

// 创建用户
router.get('/user/createUser', user.createUser);

// 重置用户密码
router.get('/user/resetPassword', user.resetPassword);

// 获取用户列表
router.get('/user/fetchUserList', user.fetchUserList);

export default router;
