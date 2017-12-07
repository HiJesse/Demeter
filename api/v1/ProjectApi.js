// project api
import {
    countProject,
    createProject,
    findProject,
    findProjectByPage,
    isProjectExist,
    saveProjectInfo
} from "../../models/ProjectModel";
import orm from "orm";
import {
    RES_FAILED_COUNT_PROJECT,
    RES_FAILED_CREATE_PROJECT,
    RES_FAILED_CREATE_PROJECT_PLATFORMS,
    RES_FAILED_DELETE_PROJECT,
    RES_FAILED_DELETE_PROJECT_ALL_MEMBERS,
    RES_FAILED_DELETE_PROJECT_PLATFORMS,
    RES_FAILED_FETCH_PROJECT,
    RES_FAILED_FETCH_PROJECT_LIST,
    RES_FAILED_FIND_USER_INFO,
    RES_FAILED_NOT_ADMIN,
    RES_FAILED_PARAMS_INVALID,
    RES_FAILED_PROJECT_IS_EXIST,
    RES_FAILED_PROJECT_NOT_EXIST,
    RES_FAILED_UPDATE_PROJECT_INFO,
    RES_FAILED_USER_IS_NOT_EXIST,
    RES_MSG_COUNT_PROJECT,
    RES_MSG_CREATE_PROJECT,
    RES_MSG_CREATE_PROJECT_PLATFORMS,
    RES_MSG_DELETE_PROJECT,
    RES_MSG_DELETE_PROJECT_ALL_MEMBERS,
    RES_MSG_DELETE_PROJECT_PLATFORMS,
    RES_MSG_FETCH_PROJECT,
    RES_MSG_FETCH_PROJECT_LIST,
    RES_MSG_FIND_USER_INFO,
    RES_MSG_NOT_ADMIN,
    RES_MSG_PARAMS_INVALID,
    RES_MSG_PROJECT_IS_EXIST,
    RES_MSG_PROJECT_NOT_EXIST,
    RES_MSG_UPDATE_PROJECT_INFO,
    RES_MSG_USER_IS_NOT_EXIST,
    RES_SUCCEED
} from "../Status";
import {buildResponse} from "../../util/AjaxUtil";
import {isArrayEmpty, isObjectEmpty, isStringEmpty} from "../../util/CheckerUtil";
import {deleteProjectInfo, deleteProjectPlatforms} from "./base/BaseProjectApi";
import {deleteAllMembers} from "./base/BaseProjectMemberApi";
import * as LogUtil from "../../util/LogUtil";
import {getFullDate} from "../../util/TimeUtil";
import {isAdminUser, isUserExist} from "../../models/UserModel";
import {concatProjectAndPlatformInfo} from "../../util/ArrayUtil";

const TAG = 'ProjectApi';

/**
 * 创建新项目
 *
 * 1. 获取平台信息
 * 2. 校验项目是否已存在
 * 3. 创建项目信息
 * 4. 根据平台信息和项目ID创建项目平台信息, 并生成对应的app id
 *
 * @param req
 * @param res
 */
export const createProjectInfo = (req, res) => {
    const projectName = req.body.projectName;
    const projectDes = req.body.projectDes;
    const projectLogo = req.file;

    LogUtil.i(`${TAG} createProject ${projectName} ${projectDes}`);

    if (isStringEmpty(projectName) || isStringEmpty(projectDes)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_CREATE_PROJECT;
    let msg = RES_MSG_CREATE_PROJECT;

    findProject({
        projectName: projectName
    }).then(results => {

        if (!isArrayEmpty(results)) {
            throw {isProjectExist: true}; // 项目已经存在
        }

        return createProject({
            projectName: projectName,
            des: projectDes,
            avatar: projectLogo === undefined ? '' : projectLogo.filename,
            createAt: getFullDate(),
        });
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '创建成功'));
    }).catch(err => {
        LogUtil.e(`${TAG} createProject ${JSON.stringify(err)}`);
        if (isObjectEmpty(err)) {
            status = RES_FAILED_CREATE_PROJECT;
            msg = RES_MSG_CREATE_PROJECT;
        } else if (err.isProjectExist) {
            status = RES_FAILED_PROJECT_IS_EXIST;
            msg = RES_MSG_PROJECT_IS_EXIST;
        } else if (err.projectPlatformsCreated === false) {
            status = RES_FAILED_CREATE_PROJECT_PLATFORMS;
            msg = RES_MSG_CREATE_PROJECT_PLATFORMS;
        }
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 删除项目
 * 1. 校验请求者身份
 * 2. 删除项目相关平台信息
 * 3. 删除项目信息
 * @param req
 * @param res
 */
export const deleteProject = (req, res) => {
    let status = RES_FAILED_DELETE_PROJECT;
    let msg = RES_MSG_DELETE_PROJECT;

    const uId = req.body.uId;
    const projectId = req.body.projectId;

    isAdminUser({
        id: uId
    }).then(() => {
        return deleteProjectPlatforms(projectId);
    }).then(() => {
        return deleteProjectInfo(projectId);
    }).then(() => {
        return deleteAllMembers(projectId);
    }).then(() => {
        status = RES_SUCCEED;
        msg = null;
        res.json(buildResponse(status, {}, msg));
    }).catch((error) => {
        if (error.isAdmin === false) {
            status = RES_FAILED_NOT_ADMIN;
            msg = RES_MSG_NOT_ADMIN;
        } else if (error.projectPlatformsDeleted === false) {
            status = RES_FAILED_DELETE_PROJECT_PLATFORMS;
            msg = RES_MSG_DELETE_PROJECT_PLATFORMS;
        } else if (error.projectAllMemberDeleted === false) {
            status = RES_FAILED_DELETE_PROJECT_ALL_MEMBERS;
            msg = RES_MSG_DELETE_PROJECT_ALL_MEMBERS;
        }
        res.json(buildResponse(status, {}, msg));
    })

};

/**
 * 根据页码和项目名称模糊搜索项目列表, 其中包含平台信息
 *
 * 1. 校验是否为管理员
 * 2. 获取项目总量
 * 3. 分页查询项目列表
 * 4. 展开平台信息
 *
 * @param req
 * @param res
 */
export const fetchProjectList = (req, res) => {
    const uId = req.query.uId;
    const pageSize = Number(req.query.pageSize);
    const pageNum = Number(req.query.pageNum);
    const nameSearch = req.query.projectName;

    LogUtil.i(`${TAG} fetchProjectList ${uId} ${nameSearch}`);

    if (isStringEmpty(uId)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_FETCH_PROJECT_LIST;
    let msg = RES_MSG_FETCH_PROJECT_LIST;
    let projectCount = 0;

    const projectLike = isStringEmpty(nameSearch) || nameSearch === 'null' ? '%' : nameSearch + '%';

    isAdminUser({
        id: uId
    }).then(() => {
        return countProject({projectName: orm.like(projectLike)});
    }).then((count) => {
        projectCount = count;
        return findProjectByPage({projectName: orm.like(projectLike)}, pageSize, pageNum);
    }).then((allProjectInfo) => {
        res.json(buildResponse(RES_SUCCEED, {
            projectList: concatProjectAndPlatformInfo(allProjectInfo),
            projectCount: projectCount,
            pageNum: pageNum
        }, '查询成功'));
    }).catch((err) => {
        LogUtil.e(`${TAG} fetchProjectList ${JSON.stringify(err)}`);
        if (isObjectEmpty(err)) {
            status = RES_FAILED_FETCH_PROJECT_LIST;
            msg = RES_MSG_FETCH_PROJECT_LIST;
        } else if (err.isAdminUserError) {
            status = RES_FAILED_FIND_USER_INFO;
            msg = RES_MSG_FIND_USER_INFO;
        } else if (err.userNotExist) {
            status = RES_FAILED_USER_IS_NOT_EXIST;
            msg = RES_MSG_USER_IS_NOT_EXIST;
        } else if (err.isNotAdmin) {
            status = RES_FAILED_NOT_ADMIN;
            msg = RES_MSG_NOT_ADMIN;
        } else if (err.countProjectError) {
            status = RES_FAILED_COUNT_PROJECT;
            msg = RES_MSG_COUNT_PROJECT;
        }
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 更新项目信息, 项目简介和项目logo
 *
 * 1. 判断用户是否存在
 * 2. 判断项目是否存在
 * 3. 判断用户是否有权限更新该项目
 * 4. 更新信息
 *
 * @param req
 * @param res
 */
export const updateProjectInfo = (req, res) => {
    const uId = req.body.uId;
    const projectId = req.body.projectId;
    const projectDes = req.body.projectDes;
    const projectLogo = req.file;

    LogUtil.i(`${TAG} updateProjectInfo ${uId} ${projectId} ${projectDes}`);

    if (isStringEmpty(projectDes) || isStringEmpty(uId) || isStringEmpty(projectId)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_UPDATE_PROJECT_INFO;
    let msg = RES_MSG_UPDATE_PROJECT_INFO;
    let avatar;

    if (!isObjectEmpty(projectLogo) && !isStringEmpty(projectLogo.filename)) {
        avatar = projectLogo.filename;
    }

    isUserExist({
        id: uId
    }).then(user => {
        return isProjectExist({id: projectId});
    }).then(project => {
        project.des = projectDes;
        project.avatar = avatar;
        return saveProjectInfo(project);
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '更新成功'));
    }).catch(err => {
        LogUtil.e(`${TAG} updateProjectInfo ${JSON.stringify(err)}`);
        if (isObjectEmpty(err)) {
            status = RES_FAILED_UPDATE_PROJECT_INFO;
            msg = RES_MSG_UPDATE_PROJECT_INFO;
        } else if (err.userNotExist) {
            status = RES_FAILED_USER_IS_NOT_EXIST;
            msg = RES_MSG_USER_IS_NOT_EXIST;
        } else if (err.isUserExistError) {
            status = RES_FAILED_FIND_USER_INFO;
            msg = RES_MSG_FIND_USER_INFO;
        } else if (err.isProjectExistError) {
            status = RES_FAILED_FETCH_PROJECT;
            msg = RES_MSG_FETCH_PROJECT;
        } else if (err.isProjectNotExist) {
            status = RES_FAILED_PROJECT_NOT_EXIST;
            msg = RES_MSG_PROJECT_NOT_EXIST;
        }
        res.json(buildResponse(status, {}, msg));
    });
};