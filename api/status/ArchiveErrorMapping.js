// archive error response mapping
import {isObjectEmpty} from "../../util/CheckerUtil";
import {buildUserErrorStatus} from "./UserErrorMapping";
import {buildProjectErrorStatus} from "./ProjectErrorMapping";
import {
    RES_FAILED_ARCHIVE_NOT_EXIST,
    RES_FAILED_CONCAT_ARCHIVE_PROJECT,
    RES_FAILED_COUNT_ARCHIVE,
    RES_FAILED_DELETE_ARCHIVE,
    RES_FAILED_FETCH_ARCHIVES,
    RES_FAILED_PARSE_IOS_IPA_ERROR,
    RES_FAILED_UPLOAD_OTA_PLIST_ERROR,
    RES_MSG_ARCHIVE_NOT_EXIST,
    RES_MSG_CONCAT_ARCHIVE_PROJECT,
    RES_MSG_COUNT_ARCHIVE,
    RES_MSG_DELETE_ARCHIVE,
    RES_MSG_FETCH_ARCHIVES,
    RES_MSG_PARSE_IOS_IPA_ERROR,
    RES_MSG_UPLOAD_OTA_PLIST_ERROR
} from "./Status";

/**
 * 构建文档模块的错误信息
 * @param err 异常
 * @param code 错误编码
 * @param msg 错误消息
 * @returns {[*,*]}
 */
export const buildArchiveErrorStatus = (err, code, msg) => {
    if (isObjectEmpty(err)) {
        return [code, msg];
    }

    // 过滤用户错误
    [code, msg] = buildUserErrorStatus(err, code, msg);

    // 过滤用户错误
    [code, msg] = buildProjectErrorStatus(err, code, msg);

    if (err.concatArchiveAndProjectInfoError) {
        code = RES_FAILED_CONCAT_ARCHIVE_PROJECT;
        msg = RES_MSG_CONCAT_ARCHIVE_PROJECT;
    } else if (err.findArchiveError) {
        code = RES_FAILED_FETCH_ARCHIVES;
        msg = RES_MSG_FETCH_ARCHIVES;
    } else if (err.isArchiveExistNotExist) {
        code = RES_FAILED_ARCHIVE_NOT_EXIST;
        msg = RES_MSG_ARCHIVE_NOT_EXIST;
    } else if (err.deleteArchiveInfoError) {
        code = RES_FAILED_DELETE_ARCHIVE;
        msg = RES_MSG_DELETE_ARCHIVE;
    } else if (err.countArchiveError) {
        code = RES_FAILED_COUNT_ARCHIVE;
        msg = RES_MSG_COUNT_ARCHIVE;
    } else if (err.parseIOSPlatformIPAArchiveError) {
        code = RES_FAILED_PARSE_IOS_IPA_ERROR;
        msg = RES_MSG_PARSE_IOS_IPA_ERROR;
    } else if (err.uploadIOSIPAPlistError) {
        code = RES_FAILED_UPLOAD_OTA_PLIST_ERROR;
        msg = RES_MSG_UPLOAD_OTA_PLIST_ERROR;
    }

    return [code, msg];

};