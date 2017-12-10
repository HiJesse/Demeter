// archive api
import {buildResponse} from "../../util/AjaxUtil";
import {
    RES_FAILED_PARAMS_INVALID,
    RES_FAILED_UPLOAD_ARCHIVE,
    RES_MSG_PARAMS_INVALID,
    RES_MSG_UPLOAD_ARCHIVE,
    RES_SUCCEED
} from "../status/Status";
import {isObjectEmpty, isStringEmpty} from "../../util/CheckerUtil";
import * as LogUtil from "../../util/LogUtil";
import {isProjectPlatformExist} from "../../models/ProjectPlatformModel";
import {isProjectExist} from "../../models/ProjectModel";
import {buildProjectErrorStatus} from "../status/ProjectErrorMapping";
import {createArchive} from "../../models/ArchiveModel";
import {getFullDate} from "../../util/TimeUtil";

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
        [status, msg] = buildProjectErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};