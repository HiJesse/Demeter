import express from "express";
import * as user from "./v1/UserApi";
import * as project from "./v1/ProjectApi";
import {ProjectArchiveMulter, ProjectLogoMulter} from "../util/MulterUtil";
import * as projectMember from "./v1/ProjectMemberApi";
import * as dashboard from "./v1/DashboardApi";
import * as archive from "./v1/ArchiveApi";

const router = express.Router();

/*用户相关*/

// 登录
router.post('/user/login', user.login);

// 修改密码
router.post('/user/modifyPassword', user.modifyPassword);

// 获取用户信息
router.get('/user/getUserInfo', user.getUserInfo);

// 跟新用户基本信息
router.post('/user/updateGeneralInfo', user.updateUserInfo);

// 创建用户
router.post('/user/createUser', user.createUserInfo);

// 重置用户密码
router.post('/user/resetPassword', user.resetPassword);

// 获取用户列表
router.get('/user/fetchUserList', user.fetchUserList);

// 用户列表中更新用户信息
router.post('/user/updateUser', user.updateUserInfoByAdmin);

// 删除用户
router.post('/user/deleteUser', user.deleteUserInfo);

/*项目相关*/

// 新建项目
router.post('/project/createProject', ProjectLogoMulter.single('projectLogo'), project.createProjectInfo);

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

// 删除项目成员
router.post('/project/deleteMember', projectMember.deleteProjectMember);

// 获取用户加入的项目列表
router.get('/project/fetchJoinedProjectList', projectMember.fetchJoinedProjectList);

// 退出项目
router.post('/project/quitProject', projectMember.quitProject);

/*dashboard 相关*/

// 获取仪表盘信息
router.get('/dashboard/fetchDashboard', dashboard.fetchDashboard);

/* archive 相关*/

// 上传文档 web
router.post('/archive/uploadArchive', ProjectArchiveMulter.single('archive'), archive.uploadArchive);
// 上传文档 cli
router.post('/archive/uploadArchiveByCLI', ProjectArchiveMulter.single('archive'), archive.uploadArchiveByCLI);
// 获取文档列表
router.get('/archive/fetchArchiveList', archive.fetchArchiveList);
// 删除文档
router.post('/archive/deleteArchive', archive.deleteArchive);

export default router;
