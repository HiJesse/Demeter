// archive api
import orm from "orm";
import {buildResponse} from "../../util/AjaxUtil";
import {
    RES_FAILED_DELETE_ARCHIVE,
    RES_FAILED_FETCH_ARCHIVE,
    RES_FAILED_PARAMS_INVALID,
    RES_FAILED_UPLOAD_ARCHIVE,
    RES_MSG_DELETE_ARCHIVE,
    RES_MSG_FETCH_ARCHIVE,
    RES_MSG_PARAMS_INVALID,
    RES_MSG_UPLOAD_ARCHIVE,
    RES_SUCCEED
} from "../status/Status";
import {isNumberInvalid, isObjectEmpty, isStringEmpty} from "../../util/CheckerUtil";
import * as LogUtil from "../../util/LogUtil";
import {isProjectPlatformExist} from "../../models/ProjectPlatformModel";
import {findProject, isProjectExist} from "../../models/ProjectModel";
import {createArchive, deleteArchiveInfo, findArchiveByPage, isArchiveExist} from "../../models/ArchiveModel";
import {getFullDate} from "../../util/TimeUtil";
import {isAdminUser, isUserExist} from "../../models/UserModel";
import {buildArchiveErrorStatus} from "../status/ArchiveErrorMapping";
import {findUserJoinedProjects} from "./base/BaseProjectMemberApi";
import {concatArchiveAndProjectInfo, splitProjectID} from "../../util/ArrayUtil";

const TAG = 'ArchiveApi';

/**
 * 上传文档接口, cli使用
 *
 * 1. 校验项目平台信息是否存在
 * 2. 反查项目是否存在
 * 3. 创建文档记录并添加进项目中
 *
 * @param req
 * @param res
 */
export const uploadArchive = (req, res) => {
    const appId = req.body.appId;
    const archiveDes = req.body.archiveDes;
    const archive = req.file;

    LogUtil.i(`${TAG} uploadArchive ${appId}`);
    if (isStringEmpty(appId) || isObjectEmpty(archive)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_UPLOAD_ARCHIVE;
    let msg = RES_MSG_UPLOAD_ARCHIVE;
    let platformId = 1;

    isProjectPlatformExist({
        appId: appId
    }).then(projectPlatform => {
        platformId = projectPlatform.platforms_id;
        return isProjectExist({
            id: projectPlatform.project_id
        });
    }).then(project => {
        const createArchiveParams = {
            projectId: project.id,
            platformId: platformId,
            archiveName: archive.originalname,
            archivePath: archive.filename,
            archiveSize: archive.size,
            createAt: getFullDate(),
        };

        if (!isStringEmpty(archiveDes)) {
            createArchiveParams.des = archiveDes;
        }

        return createArchive(createArchiveParams, project);
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '创建文档成功'));
    }).catch(err => {
        LogUtil.e(`${TAG} uploadArchive ${JSON.stringify(err)}`);
        [status, msg] = buildArchiveErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 分页获取文档列表 支持按项目 | 平台 | 文档说明模糊匹配
 *
 * 1. 校验用户是否存在
 * 2. 模糊查询查用户已加入的项目
 * 3. 根据项目信息模糊查询文档信息
 * 4. 分页整合数据
 *
 * @param req
 * @param res
 */
export const fetchArchiveList = (req, res) => {
    const uId = req.query.uId;
    const pageSize = Number(req.query.pageSize);
    const pageNum = Number(req.query.pageNum);
    const projectId = req.query.projectId;
    const platformId = req.query.platformId;

    LogUtil.i(`${TAG} fetchArchiveList ${uId} ${projectId} ${platformId} ${pageSize} ${pageNum}`);

    if (isStringEmpty(uId) || !isNumberInvalid(pageSize) || !isNumberInvalid(pageNum)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_FETCH_ARCHIVE;
    let msg = RES_MSG_FETCH_ARCHIVE;
    let projectList;

    // 模糊查询
    const projectLike = isStringEmpty(projectId) || projectId === 'null' ? '%' : projectId + '%';
    const platformLike = isStringEmpty(platformId) || platformId === 'null' ? '%' : platformId + '%';
    const projectLikeParams = {id: orm.like(projectLike)};

    isUserExist({
        id: uId
    }).then(user => {
        if (user.admin) { // 如果是管理员则查询所有项目
            return findProject(projectLikeParams);
        } else {
            return findUserJoinedProjects(user, projectLikeParams);
        }
    }).then(projects => {
        projectList = projects;
        return findArchiveByPage({
            projectId: splitProjectID(projects),
            platformId: orm.like(platformLike)
        }, pageSize, pageNum);
    }).then(archives => {
        res.json(buildResponse(RES_SUCCEED, {
            archiveList: concatArchiveAndProjectInfo(archives, projectList),
            archiveCount: archives.length,
            pageNum: pageNum
        }, '查询成功'));
    }).catch(err => {
        LogUtil.e(`${TAG} fetchArchiveList ${JSON.stringify(err)}`);
        [status, msg] = buildArchiveErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 删除文档
 *
 * 1. 用户鉴权
 * 2. 文档是否存在
 * 3. 删除文档
 *
 * @param req
 * @param res
 */
export const deleteArchive = (req, res) => {
    const uId = req.body.uId;
    const archiveId = req.body.archiveId;

    LogUtil.i(`${TAG} deleteArchive ${uId} ${archiveId}`);

    if (isStringEmpty(uId) || !isNumberInvalid(archiveId)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_DELETE_ARCHIVE;
    let msg = RES_MSG_DELETE_ARCHIVE;

    isAdminUser({
        id: uId
    }).then(() => {
        return isArchiveExist({id: archiveId});
    }).then(archive => {
        return deleteArchiveInfo(archive);
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '删除成功'));
    }).catch(err => {
        LogUtil.e(`${TAG} deleteArchive ${JSON.stringify(err)}`);
        [status, msg] = buildArchiveErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};