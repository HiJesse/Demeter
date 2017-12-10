// project error response mapping
import {isObjectEmpty} from "../../util/CheckerUtil";
import {buildUserErrorStatus} from "./UserErrorMapping";
import {
    RES_FAILED_COUNT_PROJECT,
    RES_FAILED_COUNT_PROJECT_PLATFORM,
    RES_FAILED_FETCH_PROJECT,
    RES_FAILED_FETCH_PROJECT_MEMBERS,
    RES_FAILED_FETCH_PROJECT_PLATFORM,
    RES_FAILED_PROJECT_IS_EXIST,
    RES_FAILED_PROJECT_NOT_EXIST,
    RES_FAILED_USER_JOINED_PROJECT,
    RES_FAILED_USER_NOT_JOINED_PROJECT,
    RES_MSG_COUNT_PROJECT,
    RES_MSG_COUNT_PROJECT_PLATFORM,
    RES_MSG_FETCH_PROJECT,
    RES_MSG_FETCH_PROJECT_MEMBERS,
    RES_MSG_FETCH_PROJECT_PLATFORM,
    RES_MSG_PROJECT_IS_EXIST,
    RES_MSG_PROJECT_NOT_EXIST,
    RES_MSG_USER_JOINED_PROJECT,
    RES_MSG_USER_NOT_JOINED_PROJECT
} from "./Status";

/**
 * 构建项目模块的错误信息
 * @param err 异常
 * @param code 错误编码
 * @param msg 错误消息
 * @returns {[*,*]}
 */
export const buildProjectErrorStatus = (err, code, msg) => {
    if (isObjectEmpty(err)) {
        return [code, msg];
    }

    // 过滤用户错误
    [code, msg] = buildUserErrorStatus(err, code, msg);

    if (err.isProjectExistError) {
        code = RES_FAILED_FETCH_PROJECT;
        msg = RES_MSG_FETCH_PROJECT;
    } else if (err.isProjectNotExist) {
        code = RES_FAILED_PROJECT_NOT_EXIST;
        msg = RES_MSG_PROJECT_NOT_EXIST;
    } else if (err.countProjectError) {
        code = RES_FAILED_COUNT_PROJECT;
        msg = RES_MSG_COUNT_PROJECT;
    } else if (err.isProjectExist) {
        code = RES_FAILED_PROJECT_IS_EXIST;
        msg = RES_MSG_PROJECT_IS_EXIST;
    } else if (err.findProjectMemberError) {
        code = RES_FAILED_FETCH_PROJECT_MEMBERS;
        msg = RES_MSG_FETCH_PROJECT_MEMBERS;
    } else if (err.isNotJoinedProject) {
        code = RES_FAILED_USER_NOT_JOINED_PROJECT;
        msg = RES_MSG_USER_NOT_JOINED_PROJECT;
    } else if (err.isJoinedProject) {
        code = RES_FAILED_USER_JOINED_PROJECT;
        msg = RES_MSG_USER_JOINED_PROJECT;
    } else if (err.isProjectPlatformExistError) {
        code = RES_FAILED_FETCH_PROJECT_PLATFORM;
        msg = RES_MSG_FETCH_PROJECT_PLATFORM;
    } else if (err.isProjectPlatformNotExist) {
        code = RES_FAILED_COUNT_PROJECT_PLATFORM;
        msg = RES_MSG_COUNT_PROJECT_PLATFORM;
    }

    return [code, msg];

};