// project manager actions
import {
    ACTION_CREATE_PROJECT,
    ACTION_GET_LOGO_FILE,
    ACTION_SHOW_LOGO_PREVIEW,
    ACTION_UPDATE_PROJECT_DES,
    ACTION_UPDATE_PROJECT_LOADING,
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
export const getLogoFileAction = file => ({
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
export const createProjectAction = (projectName, projectDes, logo) => ({
    type: ACTION_CREATE_PROJECT,
    data: {
        projectName: projectName,
        projectDes: projectDes,
        projectLogo: logo
    }
});

/**
 * 更新项目信息时菊花状态
 * @param visible
 */
export const updateProjectLoadingAction = visible => ({
    type: ACTION_UPDATE_PROJECT_LOADING,
    data: {
        confirmLoading: visible
    }
});

/**
 * 更新项目简介内容, 只是view
 * @param des
 */
export const updateProjectDesAction = des => ({
    type: ACTION_UPDATE_PROJECT_DES,
    data: {
        des: des
    }
});