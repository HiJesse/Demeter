// user api
import {
    RES_FAILED_PARAMS_INVALID,
    RES_FAILED_PROJECT_ADD_MEMBER,
    RES_FAILED_USER_JOINED_PROJECT,
    RES_FAILED_USER_NONE,
    RES_MSG_PARAMS_INVALID,
    RES_MSG_PROJECT_ADD_MEMBER,
    RES_MSG_USER_JOINED_PROJECT,
    RES_MSG_USER_NONE,
    RES_SUCCEED
} from "../../util/status";
import {buildResponse} from "../../util/ajax";
import {isObjectEmpty, isStringEmpty} from "../../util/checker";
import {isAdmin, isUserExist} from "./base/baseUserApi";
import {createProjectMemberInfo, isUserJoinedProject} from "./base/baseProjectApi";

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