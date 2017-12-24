// archive creation action
import {ACTION_ARCHIVE_GET_ARCHIVE_FILE} from "../constants/ActionType";

/**
 * 获取文档文件, 上传用
 * @param file
 */
export const getArchiveFileAction = file => ({
    type: ACTION_ARCHIVE_GET_ARCHIVE_FILE,
    data: {
        file: file
    }
});