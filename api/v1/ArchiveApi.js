// archive api
import {buildResponse} from "../../util/AjaxUtil";
import orm from "orm";
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
import {isArray, isNumberInvalid, isObjectEmpty, isStringEmpty} from "../../util/CheckerUtil";
import * as LogUtil from "../../util/LogUtil";
import {isProjectPlatformExist} from "../../models/ProjectPlatformModel";
import {findProject, isProjectExist} from "../../models/ProjectModel";
import {
    countArchive,
    createArchive,
    deleteArchiveInfo,
    findArchiveByPage,
    isArchiveExist
} from "../../models/ArchiveModel";
import {getFullDate} from "../../util/TimeUtil";
import {isAdminUser, isUserExist} from "../../models/UserModel";
import {buildArchiveErrorStatus} from "../status/ArchiveErrorMapping";
import {findUserJoinedProjects} from "./base/BaseProjectMemberApi";
import {concatArchiveAndProjectInfo, splitProjectID} from "../../util/ArrayUtil";
import UpYunUtil from "../../util/UpYunUtil";
import * as IPAUtil from "../../util/IPAUtil";
import * as PathUtil from "../../util/PathUtil";
import * as FileUtil from "../../util/FileUtil";

const TAG = 'ArchiveApi';

/**
 * 上传文档接口, cli使用
 *
 * 1. 校验用户是否存在
 * 2. 校验用户是否加入该项目
 * 3. 判断IOS IPA 是否需要OTA
 * 4. 创建文档记录并添加进项目中
 *
 * @param req
 * @param res
 */
export const uploadArchive = (req, res) => {
    const uId = req.body.uId;
    const projectId = req.body.projectId;
    const platformId = req.body.platformId;
    const archiveDes = req.body.archiveDes;
    const archive = req.file;

    LogUtil.i(`${TAG} uploadArchive ${uId} ${projectId} ${platformId} ${archiveDes}`);
    if (isStringEmpty(uId) || isObjectEmpty(archive) || isObjectEmpty(projectId) || isObjectEmpty(platformId)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_UPLOAD_ARCHIVE;
    let msg = RES_MSG_UPLOAD_ARCHIVE;
    let project;

    isUserExist({
        id: uId
    }).then(user => {
        if (user.admin) { // 如果是管理员则校验项目是否存在
            return isProjectExist({id: projectId});
        } else { // 普通用户校验用户是否加入改项目
            return findUserJoinedProjects(user, {id: projectId});
        }
    }).then(data => {
        project = data;
        return parseIOSPlatformIPAArchive(platformId, archive);
    }).then(data => {
        // 兼容两个promise返回值
        const projectObj = isArray(project) ? project[0] : project;
        const createArchiveParams = {
            projectId: projectId,
            platformId: platformId,
            archiveName: archive.originalname,
            archivePath: archive.filename,
            archiveSize: archive.size,
            createdAt: getFullDate(),
        };

        if (!isStringEmpty(archiveDes)) {
            createArchiveParams.des = archiveDes;
        }

        if (!isObjectEmpty(data)) {
            createArchiveParams.extraData = data.OTAUrl;
        }

        return createArchive(createArchiveParams, projectObj);
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '创建文档成功'));
    }).catch(err => {
        LogUtil.e(`${TAG} uploadArchive ${JSON.stringify(err)}`);
        [status, msg] = buildArchiveErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 上传文档接口, cli使用
 *
 * 1. 校验项目平台信息是否存在
 * 2. 反查项目是否存在
 * 3. 判断IOS IPA 是否需要OTA
 * 4. 创建文档记录并添加进项目中
 *
 * @param req
 * @param res
 */
export const uploadArchiveByCLI = (req, res) => {
    const appId = req.body.appId;
    const archiveDes = req.body.archiveDes;
    const archive = req.file;

    LogUtil.i(`${TAG} uploadArchiveByCLI ${appId}`);
    if (isStringEmpty(appId) || isObjectEmpty(archive)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_UPLOAD_ARCHIVE;
    let msg = RES_MSG_UPLOAD_ARCHIVE;
    let platformId = 1;
    let project;

    isProjectPlatformExist({
        appId: appId
    }).then(projectPlatform => {
        platformId = projectPlatform.platforms_id;
        return isProjectExist({
            id: projectPlatform.project_id
        });
    }).then(data => {
        project = data;
        return parseIOSPlatformIPAArchive(platformId, archive);
    }).then(data => {
        const createArchiveParams = {
            projectId: project.id,
            platformId: platformId,
            archiveName: archive.originalname,
            archivePath: archive.filename,
            archiveSize: archive.size,
            createdAt: getFullDate(),
        };

        if (!isStringEmpty(archiveDes)) {
            createArchiveParams.des = archiveDes;
        }

        if (!isObjectEmpty(data)) {
            createArchiveParams.extraData = data.OTAUrl;
        }

        return createArchive(createArchiveParams, project);
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '创建文档成功'));
    }).catch(err => {
        LogUtil.e(`${TAG} uploadArchiveByCLI ${JSON.stringify(err)}`);
        [status, msg] = buildArchiveErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 解析IOS平台归档的IPA文件, 用来IOS OTA
 *
 * 1. 判断平台是否为IOS, 归档文件是否为IPA
 * 2. 解析IPA文件, 获取Info.plist信息并输出可以OTA用的plist文件
 * 3. 创建又拍云存放OTA plist文件路径
 * 4. 上传OTA plist文件到又拍云
 * 5. 拼装OTA plist https下载地址
 *
 * @param platformId
 * @param archive
 */
const parseIOSPlatformIPAArchive = (platformId, archive) => new Promise((resolve, reject) => {
    // if (String(platformId) !== String(PLATFORM_IOS.platformId + 1) || !archive.originalname.endsWith('.ipa')) {
    //     resolve({});
    //     return;
    // }
    resolve({});
    return; //TODO 当前版本先屏蔽IOS OTA

    const up = new UpYunUtil();
    const publicPath = `${PathUtil.UPLOAD_PATH}${PathUtil.UPLOAD_PROJECT_ARCHIVE}`;
    const archiveRealPath = `${publicPath}${archive.filename}`;
    const plistLocalPath = `${archiveRealPath}.plist`;
    const plistUpYunPath = `download/test/${archive.filename}.plist`;
    const ipaDownloadUrl = `${PathUtil.URL_ARCHIVE}${archive.filename}`;

    IPAUtil.parseIPA(archiveRealPath, plistLocalPath, ipaDownloadUrl, (err) => {

        if (err) {
            LogUtil.e(`${TAG} parseIOSPlatformIPAArchive ${err}`);
            reject({parseIOSPlatformIPAArchiveError: true});
            return;
        }

        up.mkdir('download/test').then(() => {
            return up.upload(plistUpYunPath, plistLocalPath);
        }).then(succeed => {
            if (!succeed) {
                throw new Error('upload upyun failed');
            }
            resolve({OTAUrl: `${archive.filename}.plist`});
        }).catch(err => {
            LogUtil.e(`${TAG} uploadIOSIPAPlistError ${err}`);
            reject({uploadIOSIPAPlistError: true});
        })
    });
});

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
    const archiveDes = req.query.archiveDes;

    LogUtil.i(`${TAG} fetchArchiveList ${uId} ${projectId} ${platformId} ${archiveDes} ${pageSize} ${pageNum}`);

    if (isStringEmpty(uId) || !isNumberInvalid(pageSize) || !isNumberInvalid(pageNum)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_FETCH_ARCHIVE;
    let msg = RES_MSG_FETCH_ARCHIVE;
    let projectList;
    let projectCount = 0;

    const projectLikeParams = {};

    if (!isStringEmpty(projectId) && projectId !== 'null') {
        projectLikeParams.id = projectId;
    }

    // 模糊查询
    const archiveDesLike = isStringEmpty(archiveDes) || archiveDes === 'null' ? '%' : '%' + archiveDes + '%';

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
        const params = {
            projectId: splitProjectID(projects),
            des: orm.like(archiveDesLike),
        };

        if (!isStringEmpty(platformId) && platformId !== 'null') {
            params.platformId = platformId;
        }
        return countArchive(params);
    }).then(count => {
        projectCount = count;
        const params = {
            projectId: splitProjectID(projectList),
            des: orm.like(archiveDesLike),
        };

        if (!isStringEmpty(platformId) && platformId !== 'null') {
            params.platformId = platformId;
        }
        return findArchiveByPage(params, pageSize, pageNum);
    }).then(archives => {
        res.json(buildResponse(RES_SUCCEED, {
            archiveList: concatArchiveAndProjectInfo(archives, projectList),
            archiveCount: projectCount,
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
 * 3. 删除数据库文档
 * 4. 删除本地文档
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
    let archiveInfo;

    isAdminUser({
        id: uId
    }).then(() => {
        return isArchiveExist({id: archiveId});
    }).then(archive => {
        archiveInfo = archive;
        return deleteArchiveInfo(archive);
    }).then(() => {
        res.json(buildResponse(RES_SUCCEED, {}, '删除成功'));
        deleteLocalArchive(archiveInfo);
    }).catch(err => {
        LogUtil.e(`${TAG} deleteArchive ${JSON.stringify(err)}`);
        [status, msg] = buildArchiveErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};

/**
 * 根据数据库中的archive信息删除本地文件
 * @param archive
 */
const deleteLocalArchive = archive => {
    const publicPath = `${PathUtil.UPLOAD_PATH}${PathUtil.UPLOAD_PROJECT_ARCHIVE}`;
    const localArchive = `${publicPath}${archive.archivePath}`;
    const localExtraData = `${publicPath}${archive.extraData}`;

    if (!isStringEmpty(archive.archivePath)) {
        FileUtil.deleteFile(localArchive);
    }

    if (!isStringEmpty(archive.extraData)) {
        FileUtil.deleteFile(localExtraData);
    }
};