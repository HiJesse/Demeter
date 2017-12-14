// user api
import {
    RES_FAILED_DELETE_PROJECT_MEMBER,
    RES_FAILED_FETCH_PROJECT_LIST,
    RES_FAILED_FETCH_PROJECT_MEMBERS,
    RES_FAILED_PARAMS_INVALID,
    RES_FAILED_PROJECT_ADD_MEMBER,
    RES_FAILED_QUIT_PROJECT,
    RES_MSG_DELETE_PROJECT_MEMBER,
    RES_MSG_FETCH_PROJECT_LIST,
    RES_MSG_FETCH_PROJECT_MEMBERS,
    RES_MSG_PARAMS_INVALID,
    RES_MSG_PROJECT_ADD_MEMBER,
    RES_MSG_QUIT_PROJECT,
    RES_SUCCEED
} from "../status/Status";
import {buildResponse} from "../../util/AjaxUtil";
import {isStringEmpty} from "../../util/CheckerUtil";
import {
    createProjectMemberInfo,
    deleteMemberInfo,
    findProjectMember,
    findUserJoinedProjects,
    isUserJoinedProject,
    isUserNotJoinedProject
} from "./base/BaseProjectMemberApi";
import {concatProjectAndPlatformInfo, splitListByPage} from "../../util/ArrayUtil";
import * as LogUtil from "../../util/LogUtil";
import {isAdminUser, isUserExist} from "../../models/UserModel";
import {isProjectExist} from "../../models/ProjectModel";
import {buildProjectErrorStatus} from "../status/ProjectErrorMapping";

const TAG = 'ProjectMemberApi';

/**
 * 添加项目成员
 *
 * 1. 校验请求者是否为管理员
 * 2. 校验要添加的用户是否存在
 * 3. 校验项目是否存在
 * 3. 校验用户是否已经加入项目
 * 4. 添加项目成员
 *
 * @param req
 * @param res
 */
export const addProjectMember = (req, res) => {
    const uId = req.body.uId;
    const projectId = req.body.projectId;
    const account = req.body.account;

    LogUtil.i(`${TAG} addProjectMember ${uId} ${projectId} ${account}`);

    if (isStringEmpty(uId) || isStringEmpty(projectId) || isStringEmpty(account)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_PROJECT_ADD_MEMBER;
    let msg = RES_MSG_PROJECT_ADD_MEMBER;

    let projectInfo, userInfo;

    isAdminUser({
        id: uId
    }).then(() => {
        return isUserExist({account: account});
    }).then((user) => {
        userInfo = user;
        return isProjectExist({id: projectId});
    }).then((project) => {
        projectInfo = project;
        return findProjectMember(project);
    }).then(users => {
        return isUserNotJoinedProject(users, account);
    }).then(() => {
        return createProjectMemberInfo(projectInfo, userInfo);
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '添加成功'));
    }).catch(err => {
        LogUtil.e(`${TAG} addProjectMember ${JSON.stringify(err)}`);
        [status, msg] = buildProjectErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 获取项目成员列表
 *
 * 1. 校验uId用户是否为管理员
 * 2. 校验projectId项目是否存在
 * 3. 获取项目成员总数
 * 4. 根据页码和页内容获取对应的成员列表
 * 5. 根据userId列表获取用户详情列表
 *
 * @param req
 * @param res
 */
export const fetchProjectMembers = (req, res) => {
    const uId = req.query.uId;
    const pageSize = Number(req.query.pageSize);
    const pageNum = Number(req.query.pageNum);
    const projectId = req.query.projectId;
    let projectMemberCount;

    LogUtil.i(`${TAG} fetchProjectMembers ${uId} ${projectId} ${pageNum} ${pageSize}`);

    if (isStringEmpty(uId) || isStringEmpty(projectId)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_FETCH_PROJECT_MEMBERS;
    let msg = RES_MSG_FETCH_PROJECT_MEMBERS;

    isAdminUser({
        id: uId
    }).then(() => {
        return isProjectExist({id: projectId});
    }).then(project => {
        return findProjectMember(project);
    }).then((users) => {
        projectMemberCount = users.length;
        users = splitListByPage(users, pageSize, pageNum)
        res.json(buildResponse(RES_SUCCEED, {
            projectMemberList: users.map(item => ({
                account: item.account,
                nickname: item.nickName,
                userId: item.id
            })),
            projectMembers: projectMemberCount,
            pageNum: pageNum
        }, '查询成功'));
    }).catch((err) => {
        LogUtil.e(`${TAG} fetchProjectMembers ${JSON.stringify(err)}`);
        [status, msg] = buildProjectErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 删除项目成员
 *
 * 1. 校验uId用户是否存在
 * 2. 校验userId用户是否存在
 * 3. 校验projectId项目是否存在
 * 4. 校验userId 是否已经加入项目
 * 5. 删除成员
 *
 * @param req
 * @param res
 */
export const deleteProjectMember = (req, res) => {
    const uId = req.body.uId;
    const projectId = req.body.projectId;
    const userId = req.body.userId;

    LogUtil.i(`${TAG} deleteProjectMember ${uId} ${projectId} ${userId}`);

    if (isStringEmpty(uId) || isStringEmpty(projectId)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_DELETE_PROJECT_MEMBER;
    let msg = RES_MSG_DELETE_PROJECT_MEMBER;

    let memberInfo, projectInfo;

    isAdminUser({
        id: uId
    }).then(() => {
        return isUserExist({id: userId});
    }).then(user => {
        memberInfo = user;
        return isProjectExist({id: projectId});
    }).then(project => {
        projectInfo = project;
        return findProjectMember(project);
    }).then(users => {
        return isUserJoinedProject(users, memberInfo.account);
    }).then(() => {
        return deleteMemberInfo(projectInfo, memberInfo);
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '删除成功'));
    }).catch(err => {
        LogUtil.e(`${TAG} deleteProjectMember ${JSON.stringify(err)}`);
        [status, msg] = buildProjectErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 分页获取用户加入的项目列表
 *
 * 1. 校验用户是否存在
 * 2. 反查用户所加入的项目
 * 3. 按页切割数据
 * 4. 展开项目平台信息
 *
 * @param req
 * @param res
 */
export const fetchJoinedProjectList = (req, res) => {
    const uId = req.query.uId;
    const pageSize = Number(req.query.pageSize);
    const pageNum = Number(req.query.pageNum);

    LogUtil.i(`${TAG} fetchJoinedProjectList ${uId} ${pageNum} ${pageSize}`);

    if (isStringEmpty(uId)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_FETCH_PROJECT_LIST;
    let msg = RES_MSG_FETCH_PROJECT_LIST;
    let projectCount = 0;

    isUserExist({
        id: uId
    }).then(user => {
        return findUserJoinedProjects(user, {});
    }).then((projects) => {
        projectCount = projects.length;
        projects = splitListByPage(projects, pageSize, pageNum);
        res.json(buildResponse(RES_SUCCEED, {
            projectList: concatProjectAndPlatformInfo(projects),
            projectCount: projectCount,
            pageNum: pageNum
        }, '获取成功'));
    }).catch(err => {
        LogUtil.e(`${TAG} fetchJoinedProjectList ${JSON.stringify(err)}`);
        [status, msg] = buildProjectErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 退出项目
 * 1. 校验用户是否存在
 * 2. 校验用户是否加入该项目
 * 3. 退出项目
 * @param req
 * @param res
 */
export const quitProject = (req, res) => {
    const uId = req.body.uId;
    const projectId = req.body.projectId;

    LogUtil.i(`${TAG} quitProject ${uId} ${projectId}`);

    if (isStringEmpty(uId) || isStringEmpty(projectId)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_QUIT_PROJECT;
    let msg = RES_MSG_QUIT_PROJECT;

    let memberInfo, projectInfo;

    isUserExist({
        id: uId
    }).then(user => {
        memberInfo = user;
        return isProjectExist({id: projectId});
    }).then(project => {
        projectInfo = project;
        return findProjectMember(project);
    }).then(users => {
        return isUserJoinedProject(users, memberInfo.account);
    }).then(() => {
        return deleteMemberInfo(projectInfo, memberInfo);
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '删除成功'));
    }).catch(err => {
        LogUtil.e(`${TAG} quitProject ${JSON.stringify(err)}`);
        [status, msg] = buildProjectErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};