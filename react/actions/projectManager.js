// project manager actions
import {
    ACTION_CREATE_PROJECT,
    ACTION_GET_LOGO_FILE,
    ACTION_SHOW_LOGO_PREVIEW,
    ACTION_UPLOAD_LOGO
} from "../constants/actionType";

/**
 * 是否显示logo预览弹窗
 * @param isShow
 * @param file 如果需要预览则填充file
 */
export const showLogoPreviewAction = (isShow, file) => ({
    type: ACTION_SHOW_LOGO_PREVIEW,
    data: {
        previewVisible: isShow,
        file: file
    }
});

/**
 * 上传logo action 只是用来看的
 * @param file
 */
export const uploadLogoAction = file => ({
    type: ACTION_UPLOAD_LOGO,
    data: {
        file: file
    }
});

/**
 * 获取logo文件, 上传用
 * @param file
 */
export const getLogoFile = file => ({
    type: ACTION_GET_LOGO_FILE,
    data: {
        file: file
    }
});

/**
 * 创建新项目
 * @param projectName
 * @param projectDes
 * @param logo
 */
export const createProject = (projectName, projectDes, logo) => ({
    type: ACTION_CREATE_PROJECT,
    data: {
        projectName: projectName,
        projectDes: projectDes,
        projectLogo: logo
    }
});