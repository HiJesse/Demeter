// archive api
import {buildResponse} from "../../util/AjaxUtil";
import {
    RES_FAILED_FETCH_PROJECT_PLATFORM,
    RES_FAILED_PARAMS_INVALID,
    RES_FAILED_UPLOAD_ARCHIVE,
    RES_MSG_FETCH_PROJECT_PLATFORM,
    RES_MSG_PARAMS_INVALID,
    RES_MSG_UPLOAD_ARCHIVE
} from "../Status";
import {isObjectEmpty, isStringEmpty} from "../../util/CheckerUtil";
import {findProjectPlatforms} from "./base/BaseProjectApi";
import {createArchive} from "./base/BaseArchiveApi";
import * as LogUtil from "../../util/LogUtil";


/**
 * 上传文档接口, cli使用
 *
 * 1. 校验文档是否有效
 * 2. 校验appId 合法性和信息
 * 3. 创建文档记录
 *
 * req
 * appId 项目平台唯一id
 * archiveDes 文档描述
 * archive 文档
 *
 * @param req
 * @param res
 */
export const uploadArchive = (req, res) => {
    const appId = req.body.appId;
    const archiveDes = req.body.archiveDes;
    const archive = req.file;

    LogUtil.i(`uploadArchive req ${appId}`);
    if (isStringEmpty(appId) || isObjectEmpty(archive)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_UPLOAD_ARCHIVE;
    let msg = RES_MSG_UPLOAD_ARCHIVE;

    findProjectPlatforms({appId: appId}).then((projects) => {
        if (projects.length !== 1) {
            throw {projectPlatformSize: -1};
        }

        const createArchiveParams = {
            projectId: projects[0].projectId,
            platformId: projects[0].platformId,
            archiveName: archive.originalname,
            archivePath: archive.filename,
            archiveSize: archive.size,
        };

        if (!isStringEmpty(archiveDes)) {
            createArchiveParams.des = archiveDes;
        }

        return createArchive(createArchiveParams);
    }).then(() => {
        res.json(buildResponse(0, {}, null));
    }).catch((error) => {
        if (isObjectEmpty(error)) {
            status = RES_FAILED_UPLOAD_ARCHIVE;
            msg = RES_MSG_UPLOAD_ARCHIVE;
        } else if (error.projectPlatformSize === -1) {
            status = RES_FAILED_FETCH_PROJECT_PLATFORM;
            msg = RES_MSG_FETCH_PROJECT_PLATFORM;
        }
        res.json(buildResponse(status, {}, msg));
    });
};