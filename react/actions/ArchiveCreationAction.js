// archive creation action
import {ACTION_ARCHIVE_GET_ARCHIVE_FILE, ACTION_ARCHIVE_UPLOAD} from "../constants/ActionType";

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

/**
 * 上传文档 action
 * @param uId
 * @param file 文档
 * @param projectId 选中项目
 * @param platformId 选中平台
 * @param archiveDes 文档描述
 */
export const uploadArchiveAction = (uId, file, projectId, platformId, archiveDes) => ({
    type: ACTION_ARCHIVE_UPLOAD,
    data: {
        uId: uId,
        archive: file,
        projectId: projectId,
        platformId: platformId,
        archiveDes: archiveDes,
    }
});