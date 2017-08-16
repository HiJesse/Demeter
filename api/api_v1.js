import express from 'express';
import * as user from "./v1/user";
import * as project from "./v1/project";

const router = express.Router();

// 登录
router.post('/user/login', user.login);

// 修改密码
router.post('/user/modifyPassword', user.modifyPassword);

// 获取用户信息
router.get('/user/getUserInfo', user.getUserInfo);

// 跟新用户基本信息
router.post('/user/updateGeneralInfo', user.updateUserInfo);

// 创建用户
router.post('/user/createUser', user.createUser);

// 重置用户密码
router.post('/user/resetPassword', user.resetPassword);

// 获取用户列表
router.get('/user/fetchUserList', user.fetchUserList);

// 删除用户
router.post('/user/deleteUser', user.deleteUser);

// 新建项目
router.post('/project/createProject', project.createProject);

export default router;
