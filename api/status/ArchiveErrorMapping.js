// archive error response mapping
import {isObjectEmpty} from "../../util/CheckerUtil";
import {buildUserErrorStatus} from "./UserErrorMapping";
import {buildProjectErrorStatus} from "./ProjectErrorMapping";

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

    return [code, msg];

};