// project api
import ProjectModel, {createProject, findProject} from "../../models/ProjectModel";
import {
    RES_FAILED_COUNT_PROJECT,
    RES_FAILED_COUNT_PROJECT_EMPTY,
    RES_FAILED_CREATE_PROJECT,
    RES_FAILED_CREATE_PROJECT_PLATFORMS,
    RES_FAILED_DELETE_PROJECT,
    RES_FAILED_DELETE_PROJECT_ALL_MEMBERS,
    RES_FAILED_DELETE_PROJECT_PLATFORMS,
    RES_FAILED_FETCH_PROJECT_LIST,
    RES_FAILED_FETCH_PROJECT_PLATFORM,
    RES_FAILED_NOT_ADMIN,
    RES_FAILED_PARAMS_INVALID,
    RES_FAILED_PROJECT_IS_EXIST,
    RES_FAILED_UPDATE_PROJECT_DES,
    RES_FAILED_UPDATE_PROJECT_INFO,
    RES_MSG_COUNT_PROJECT,
    RES_MSG_COUNT_PROJECT_EMPTY,
    RES_MSG_CREATE_PROJECT,
    RES_MSG_CREATE_PROJECT_PLATFORMS,
    RES_MSG_DELETE_PROJECT,
    RES_MSG_DELETE_PROJECT_ALL_MEMBERS,
    RES_MSG_DELETE_PROJECT_PLATFORMS,
    RES_MSG_FETCH_PROJECT_LIST,
    RES_MSG_FETCH_PROJECT_PLATFORM,
    RES_MSG_NOT_ADMIN,
    RES_MSG_PARAMS_INVALID,
    RES_MSG_PROJECT_IS_EXIST,
    RES_MSG_UPDATE_PROJECT_DES,
    RES_MSG_UPDATE_PROJECT_INFO,
    RES_SUCCEED
} from "../Status";
import {buildResponse} from "../../util/AjaxUtil";
import {isArrayEmpty, isObjectEmpty, isStringEmpty} from "../../util/CheckerUtil";
import {concatProjectAndPlatformInfo} from "../../util/ArrayUtil";
import {isAdmin} from "./base/BaseUserApi";
import {
    countProjectsByName,
    deleteProjectInfo,
    deleteProjectPlatforms,
    findProjectPlatforms,
    findProjectsByName
} from "./base/BaseProjectApi";
import {deleteAllMembers} from "./base/BaseProjectMemberApi";
import * as LogUtil from "../../util/LogUtil";
import {getFullDate} from "../../util/TimeUtil";

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

    isAdmin({_id: uId}).then(() => {
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
 * 1. 校验是否为管理员
 * 2. 获取项目总量
 * 3. 根据页码获取项目列表
 * 4. 根据项目列表获取平台列表
 * 5. 整合两个列表并回调
 * @param req
 * @param res
 */
export const fetchProjectList = (req, res) => {
    const uId = req.query.uId;
    const pageSize = Number(req.query.pageSize);
    const pageNum = Number(req.query.pageNum);
    const nameSearch = req.query.projectName;
    const adminParams = {
        _id: uId
    };

    let status = RES_FAILED_FETCH_PROJECT_LIST;
    let msg = RES_MSG_FETCH_PROJECT_LIST;
    let projectCount = -1;
    let projectList;

    isAdmin(adminParams).then(() => {
        return countProjectsByName(nameSearch);
    }).then((data) => {
        projectCount = data.projectCount;
        return findProjectsByName(pageSize, pageNum, nameSearch);
    }).then((allProjectInfo) => {
        projectList = allProjectInfo;
        return findProjectPlatforms(allProjectInfo);
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
        } else if (error.isAdmin === false) {
            status = RES_FAILED_NOT_ADMIN;
            msg = RES_MSG_NOT_ADMIN;
        } else if (error.projectCount === -1) {
            status = RES_FAILED_COUNT_PROJECT;
            msg = RES_MSG_COUNT_PROJECT;
        } else if (error.projectCount === 0) {
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
 * 更新项目信息, 项目简介和项目logo
 * @param req
 * @param res
 */
export const updateProjectInfo = (req, res) => {
    const projectId = req.body.projectId;
    const projectDes = req.body.projectDes;
    const projectLogo = req.file;

    let status = RES_FAILED_UPDATE_PROJECT_INFO;
    let msg = RES_MSG_UPDATE_PROJECT_INFO;

    if (isStringEmpty(projectDes) || projectDes.length < 3) {
        status = RES_FAILED_UPDATE_PROJECT_DES;
        msg = RES_MSG_UPDATE_PROJECT_DES;
        res.json(buildResponse(status, {}, msg));
        return;
    }

    const params = {
        des: projectDes
    };

    if (!isObjectEmpty(projectLogo) && !isStringEmpty(projectLogo.filename)) {
        params.avatar = projectLogo.filename;
    }

    ProjectModel.update({
        _id: projectId
    }, {
        $set: params
    }, {upsert: false}, (error) => {
        if (!error) {
            status = RES_SUCCEED;
            msg = null;
        }
        res.json(buildResponse(status, {}, msg));
    });
};