// error response mapping
import {isObjectEmpty} from "../../util/CheckerUtil";
import {
    RES_FAILED_COUNT_USER,
    RES_FAILED_FIND_USER_INFO,
    RES_FAILED_NOT_ADMIN,
    RES_FAILED_UPDATE_USER_INFO,
    RES_FAILED_USER_ERR_PWD,
    RES_FAILED_USER_IS_EXIST,
    RES_FAILED_USER_IS_NOT_EXIST,
    RES_MSG_COUNT_USER,
    RES_MSG_FIND_USER_INFO,
    RES_MSG_NOT_ADMIN,
    RES_MSG_UPDATE_USER_INFO,
    RES_MSG_USER_ERR_PWD,
    RES_MSG_USER_IS_EXIST,
    RES_MSG_USER_IS_NOT_EXIST
} from "./Status";

/**
 * 构建用户模块的错误信息
 * @param err 异常
 * @param code 错误编码
 * @param msg 错误消息
 * @returns {[*,*]}
 */
export const buildUserErrorStatus = (err, code, msg) => {
    if (isObjectEmpty(err)) {
        return [code, msg];
    }

    if (err.isAdminUserError || err.findUserError || err.isUserExistError) {
        code = RES_FAILED_FIND_USER_INFO;
        msg = RES_MSG_FIND_USER_INFO;
    } else if (err.userNotExist) {
        code = RES_FAILED_USER_IS_NOT_EXIST;
        msg = RES_MSG_USER_IS_NOT_EXIST;
    } else if (err.isNotAdmin || err.isAdminAccount) {
        code = RES_FAILED_NOT_ADMIN;
        msg = RES_MSG_NOT_ADMIN;
    } else if (err.countUserError) {
        code = RES_FAILED_COUNT_USER;
        msg = RES_MSG_COUNT_USER;
    } else if (err.saveUserInfoError) {
        code = RES_FAILED_UPDATE_USER_INFO;
        msg = RES_MSG_UPDATE_USER_INFO;
    } else if (err.isUserExist) {
        code = RES_FAILED_USER_IS_EXIST;
        msg = RES_MSG_USER_IS_EXIST;
    } else if (err.invalidPassword) {
        code = RES_FAILED_USER_ERR_PWD;
        msg = RES_MSG_USER_ERR_PWD;
    }

    return [code, msg];

};