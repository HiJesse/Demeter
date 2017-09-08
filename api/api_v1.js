import express from "express";
import * as user from "./v1/userApi";
import * as project from "./v1/projectApi";
import {ProjectLogoMulter} from "../util/multer";
import * as projectMember from "./v1/projectMemberApi";

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
router.post('/project/createProject', ProjectLogoMulter.single('projectLogo'), project.createProject);

// 删除项目
router.post('/project/deleteProject', project.deleteProject);

// 获取项目列表
router.get('/project/fetchProjectList', project.fetchProjectList);

// 更新项目信息
router.post('/project/updateProjectInfo', ProjectLogoMulter.single('projectLogo'), project.updateProjectInfo);

// 添加项目成员
router.post('/project/addMember', projectMember.addProjectMember);

// 获取项目成员列表
router.get('/project/fetchProjectMemberList', projectMember.fetchProjectMembers);

export default router;
