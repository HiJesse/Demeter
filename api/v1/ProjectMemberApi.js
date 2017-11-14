// user api
import {
    RES_FAILED_COUNT_PROJECT,
    RES_FAILED_COUNT_PROJECT_EMPTY,
    RES_FAILED_COUNT_PROJECT_MEMBERS,
    RES_FAILED_DELETE_PROJECT_MEMBER,
    RES_FAILED_FETCH_PROJECT_LIST,
    RES_FAILED_FETCH_PROJECT_MEMBERS,
    RES_FAILED_FETCH_PROJECT_PLATFORM,
    RES_FAILED_FIND_USERS_INFO,
    RES_FAILED_NOT_ADMIN,
    RES_FAILED_PARAMS_INVALID,
    RES_FAILED_PROJECT_ADD_MEMBER,
    RES_FAILED_PROJECT_NOT_EXIST,
    RES_FAILED_QUIT_PROJECT,
    RES_FAILED_USER_JOINED_PROJECT,
    RES_FAILED_USER_NONE,
    RES_FAILED_USER_NOT_JOINED_PROJECT,
    RES_MSG_COUNT_PROJECT,
    RES_MSG_COUNT_PROJECT_EMPTY,
    RES_MSG_COUNT_PROJECT_MEMBERS,
    RES_MSG_DELETE_PROJECT_MEMBER,
    RES_MSG_FETCH_PROJECT_LIST,
    RES_MSG_FETCH_PROJECT_MEMBERS,
    RES_MSG_FETCH_PROJECT_PLATFORM,
    RES_MSG_FIND_USERS_INFO,
    RES_MSG_NOT_ADMIN,
    RES_MSG_PARAMS_INVALID,
    RES_MSG_PROJECT_ADD_MEMBER,
    RES_MSG_PROJECT_NOT_EXIST,
    RES_MSG_QUIT_PROJECT,
    RES_MSG_USER_JOINED_PROJECT,
    RES_MSG_USER_NONE,
    RES_MSG_USER_NOT_JOINED_PROJECT,
    RES_SUCCEED
} from "../Status";
import {buildResponse} from "../../util/AjaxUtil";
import {isObjectEmpty, isStringEmpty} from "../../util/CheckerUtil";
import {findUsersByAccounts, isAdmin, isUserExist} from "./base/BaseUserApi";
import {findProjectPlatforms, findProjectsByIDs, getProjectInfo} from "./base/BaseProjectApi";
import {
    countProjectMembers,
    countUserJoinedProjects,
    createProjectMemberInfo,
    deleteMember,
    findProjectMembersByPage,
    findUserJoinedProjects,
    isUserJoinedProject,
    isUserNotJoinedProject
} from "./base/BaseProjectMemberApi";
import {concatProjectAndPlatformInfo} from "../../util/ArrayUtil";

/**
 * 添加项目成员
 * 1. 校验请求者是否为管理员
 * 2. 校验要添加的用户是否存在
 * 3. 校验用户是否已经加入项目
 * 4. 添加项目
 * @param req
 * @param res
 */
export const addProjectMember = (req, res) => {
    const uId = req.body.uId;
    const projectId = req.body.projectId;
    const account = req.body.account;

    let status = RES_FAILED_PROJECT_ADD_MEMBER;
    let msg = RES_MSG_PROJECT_ADD_MEMBER;

    if (isStringEmpty(uId) || isStringEmpty(projectId) || isStringEmpty(account)) {
        status = RES_FAILED_PARAMS_INVALID;
        msg = RES_MSG_PARAMS_INVALID;
        res.json(buildResponse(status, {}, msg));
        return;
    }

    const adminParams = {
        _id: uId
    };

    isAdmin(adminParams).then(() => {
        return isUserExist({account: account});
    }).then(() => {
        return isUserNotJoinedProject({projectId: projectId, userAccount: account});
    }).then(() => {
        return createProjectMemberInfo({projectId: projectId, userAccount: account});
    }).then(() => {
        status = RES_SUCCEED;
        msg = null;
        res.json(buildResponse(status, {}, msg));
    }).catch((error) => {
        if (isObjectEmpty(error)) {
            status = RES_FAILED_PROJECT_ADD_MEMBER;
            msg = RES_MSG_PROJECT_ADD_MEMBER;
        } else if (error.isAdmin === false) {
            status = RES_FAILED_NOT_ADMIN;
            msg = RES_MSG_NOT_ADMIN;
        } else if (error.isUserExist === false) {
            status = RES_FAILED_USER_NONE;
            msg = RES_MSG_USER_NONE;
        } else if (error.isUserNotJoined === false) {
            status = RES_FAILED_USER_JOINED_PROJECT;
            msg = RES_MSG_USER_JOINED_PROJECT;
        }
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 获取项目成员列表
 * 1. 校验uId用户是否存在
 * 2. 校验projectId项目是否存在
 * 3. 获取项目成员总数
 * 4. 根据页码和页内容获取对应的成员列表
 * 5. 根据account列表获取用户详情列表
 * @param req
 * @param res
 */
export const fetchProjectMembers = (req, res) => {
    const uId = req.query.uId;
    const pageSize = Number(req.query.pageSize);
    const pageNum = Number(req.query.pageNum);
    const projectId = req.query.projectId;
    let projectMemberCount;

    let status = RES_FAILED_FETCH_PROJECT_MEMBERS;
    let msg = RES_MSG_FETCH_PROJECT_MEMBERS;

    if (isStringEmpty(uId) || isStringEmpty(projectId)) {
        status = RES_FAILED_PARAMS_INVALID;
        msg = RES_MSG_PARAMS_INVALID;
        res.json(buildResponse(status, {}, msg));
        return;
    }

    isUserExist({_id: uId}).then(() => {
        return getProjectInfo({_id: projectId});
    }).then(() => {
        return countProjectMembers({projectId: projectId});
    }).then(count => {
        projectMemberCount = count.projectMemberCount;
        return findProjectMembersByPage(pageSize, pageNum, {projectId: projectId});
    }).then(projectMembers => {
        return findUsersByAccounts(projectMembers.map(item => item.account));
    }).then((users) => {
        status = RES_SUCCEED;
        msg = null;
        res.json(buildResponse(status, {
            projectMemberList: users.map(item => ({account: item.account, nickname: item.nickName})),
            projectMembers: projectMemberCount,
            pageNum: pageNum
        }, msg));
    }).catch((error) => {
        let params = {};
        if (isObjectEmpty(error)) {
            status = RES_FAILED_PARAMS_INVALID;
            msg = RES_MSG_PARAMS_INVALID;
        } else if (error.isUserExist === false) {
            status = RES_FAILED_USER_NONE;
            msg = RES_MSG_USER_NONE;
        } else if (error.isProjectExist === false) {
            status = RES_FAILED_PROJECT_NOT_EXIST;
            msg = RES_MSG_PROJECT_NOT_EXIST;
        } else if (error.projectMemberCount === -1) {
            status = RES_FAILED_COUNT_PROJECT_MEMBERS;
            msg = RES_MSG_COUNT_PROJECT_MEMBERS;
        } else if (error.projectMemberCount === 0) {
            status = RES_SUCCEED;
            msg = null;
            params = {
                projectMemberList: [],
                projectMembers: 0,
                pageNum: pageNum
            }
        } else if (error.findUsers === false) {
            status = RES_FAILED_FIND_USERS_INFO;
            msg = RES_MSG_FIND_USERS_INFO;
        }
        res.json(buildResponse(status, params, msg));
    });
};

/**
 * 删除项目成员
 * 1. 校验uId用户是否存在
 * 2. 校验account用户是否存在
 * 3. 校验projectId项目是否存在
 * 4. 校验account 是否已经加入项目
 * 5. 删除成员
 * @param req
 * @param res
 */
export const deleteProjectMember = (req, res) => {
    const uId = req.body.uId;
    const projectId = req.body.projectId;
    const account = req.body.account;

    let status = RES_FAILED_DELETE_PROJECT_MEMBER;
    let msg = RES_MSG_DELETE_PROJECT_MEMBER;

    if (isStringEmpty(uId) || isStringEmpty(projectId) || isStringEmpty(account)) {
        status = RES_FAILED_PARAMS_INVALID;
        msg = RES_MSG_PARAMS_INVALID;
        res.json(buildResponse(status, {}, msg));
        return;
    }

    isUserExist({_id: uId}).then(() => {
        return isUserExist({account: account});
    }).then(() => {
        return getProjectInfo({_id: projectId});
    }).then(() => {
        return isUserJoinedProject({projectId: projectId, userAccount: account});
    }).then(() => {
        return deleteMember(projectId, account);
    }).then(() => {
        status = RES_SUCCEED;
        msg = null;
        res.json(buildResponse(status, {}, msg));
    }).catch((error) => {
        if (isObjectEmpty(error)) {
            status = RES_FAILED_PARAMS_INVALID;
            msg = RES_MSG_PARAMS_INVALID;
        } else if (error.isUserExist === false) {
            status = RES_FAILED_USER_NONE;
            msg = RES_MSG_USER_NONE;
        } else if (error.isProjectExist === false) {
            status = RES_FAILED_PROJECT_NOT_EXIST;
            msg = RES_MSG_PROJECT_NOT_EXIST;
        } else if (error.isUserJoined === false) {
            status = RES_FAILED_USER_NOT_JOINED_PROJECT;
            msg = RES_MSG_USER_NOT_JOINED_PROJECT;
        }
        res.json(buildResponse(status, {}, msg));
    })
};

/**
 * 分页获取用户加入的项目列表
 * 1. 校验用户是否存在
 * 2. 获取用户加入的项目总量
 * 3. 根据页码获取项目id列表
 * 4. 获取完整的项目列表
 * 5. 获取项目列表对应的平台列表信息
 * 6. 整合两个列表并回调
 * @param req
 * @param res
 */
export const fetchJoinedProjectList = (req, res) => {
    const uId = req.query.uId;
    const pageSize = Number(req.query.pageSize);
    const pageNum = Number(req.query.pageNum);

    let status = RES_FAILED_FETCH_PROJECT_LIST;
    let msg = RES_MSG_FETCH_PROJECT_LIST;
    let projectCount = -1;
    let projectList;
    let userAccount;

    isUserExist({_id: uId}).then((userInfo) => {
        userAccount = userInfo.account;
        return countUserJoinedProjects({userAccount: userInfo.account});
    }).then((data) => {
        projectCount = data.userJoinedProjectCount;
        return findUserJoinedProjects(pageSize, pageNum, {userAccount: userAccount});
    }).then((projectIDs) => {
        return findProjectsByIDs(projectIDs.map(item => (item.projectId)));
    }).then((projects) => {
        projectList = projects;
        return findProjectPlatforms(projects);
    }).then((projectPlatformInfo) => {
        status = RES_SUCCEED;
        msg = null;
        res.json(buildResponse(status, {
            projectList: concatProjectAndPlatformInfo(projectList, projectPlatformInfo),
            projectCount: projectCount,
            pageNum: pageNum
        }, msg));
    }).catch((error) => {
        if (isObjectEmpty(error)) {
            status = RES_FAILED_FETCH_PROJECT_LIST;
            msg = RES_MSG_FETCH_PROJECT_LIST;
        } else if (error.isUserExist === false) {
            status = RES_FAILED_USER_NONE;
            msg = RES_MSG_USER_NONE;
        } else if (error.userJoinedProjectCount === -1) {
            status = RES_FAILED_COUNT_PROJECT;
            msg = RES_MSG_COUNT_PROJECT;
        } else if (error.userJoinedProjectCount === 0) {
            status = RES_FAILED_COUNT_PROJECT_EMPTY;
            msg = RES_MSG_COUNT_PROJECT_EMPTY;
        } else if (error.projectPlatformSize === -1) {
            status = RES_FAILED_FETCH_PROJECT_PLATFORM;
            msg = RES_MSG_FETCH_PROJECT_PLATFORM;
        }
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

    let status = RES_FAILED_QUIT_PROJECT;
    let msg = RES_MSG_QUIT_PROJECT;
    let userAccount;

    isUserExist({_id: uId}).then((userInfo) => {
        userAccount = userInfo.account;
        console.log(userAccount)
        return isUserJoinedProject({projectId: projectId, userAccount: userInfo.account});
    }).then(() => {
        return deleteMember(projectId, userAccount);
    }).then(() => {
        status = RES_SUCCEED;
        msg = null;
        res.json(buildResponse(status, {}, msg));
    }).catch((error) => {
        if (isObjectEmpty(error)) {
            status = RES_FAILED_FETCH_PROJECT_LIST;
            msg = RES_MSG_FETCH_PROJECT_LIST;
        } else if (error.isUserExist === false) {
            status = RES_FAILED_USER_NONE;
            msg = RES_MSG_USER_NONE;
        } else if (error.isUserJoined === false) {
            status = RES_FAILED_USER_NOT_JOINED_PROJECT;
            msg = RES_MSG_USER_NOT_JOINED_PROJECT;
        }
        res.json(buildResponse(status, {}, msg));
    });
};