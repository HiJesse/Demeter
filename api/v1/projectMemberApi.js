// user api
import {
    RES_FAILED_COUNT_PROJECT_MEMBERS,
    RES_FAILED_FETCH_PROJECT_MEMBERS,
    RES_FAILED_FIND_USERS_INFO,
    RES_FAILED_PARAMS_INVALID,
    RES_FAILED_PROJECT_ADD_MEMBER,
    RES_FAILED_PROJECT_NOT_EXIST,
    RES_FAILED_USER_JOINED_PROJECT,
    RES_FAILED_USER_NONE,
    RES_MSG_COUNT_PROJECT_MEMBERS,
    RES_MSG_FETCH_PROJECT_MEMBERS,
    RES_MSG_FIND_USERS_INFO,
    RES_MSG_PARAMS_INVALID,
    RES_MSG_PROJECT_ADD_MEMBER,
    RES_MSG_PROJECT_NOT_EXIST,
    RES_MSG_USER_JOINED_PROJECT,
    RES_MSG_USER_NONE,
    RES_SUCCEED
} from "../../util/status";
import {buildResponse} from "../../util/ajax";
import {isObjectEmpty, isStringEmpty} from "../../util/checker";
import {findUsersByAccounts, isAdmin, isUserExist} from "./base/baseUserApi";
import {
    countProjectMembers,
    createProjectMemberInfo,
    findProjectMembersByPage,
    getProjectInfo,
    isUserJoinedProject
} from "./base/baseProjectApi";

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
        return isUserJoinedProject({projectId: projectId, userAccount: account});
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
        } else if (error.isUserExist === false) {
            status = RES_FAILED_USER_NONE;
            msg = RES_MSG_USER_NONE;
        } else if (error.isUserJoined === false) {
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
        } else if (error.findUsers === false) {
            status = RES_FAILED_FIND_USERS_INFO;
            msg = RES_MSG_FIND_USERS_INFO;
        }
        res.json(buildResponse(status, {}, msg));
    });
};