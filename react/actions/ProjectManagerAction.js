// project manager actions
import {
    ACTION_CREATE_PROJECT, ACTION_DELETE_PROJECT_LOADING,
    ACTION_GET_LOGO_FILE,
    ACTION_SHOW_LOGO_PREVIEW,
    ACTION_UPDATE_PROJECT_DES,
    ACTION_UPDATE_PROJECT_INFO,
    ACTION_UPDATE_PROJECT_LOADING,
    ACTION_UPLOAD_LOGO
} from "../constants/ActionType";

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
 * 更新项目信息弹窗信息时菊花状态
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

/**
 * 更新项目信息
 * @param uId 用户ID
 * @param projectId 项目id
 * @param logo 项目logo文件
 * @param projectDes 项目简介
 */
export const updateProjectInfoAction = (uId, projectId, logo, projectDes) => ({
    type: ACTION_UPDATE_PROJECT_INFO,
    data: {
        uId: uId,
        projectId: projectId,
        projectDes: projectDes,
        projectLogo: logo
    }
});

/**
 * 删除项目弹窗时菊花状态
 * @param visible
 */
export const deleteProjectLoadingAction = visible => ({
    type: ACTION_DELETE_PROJECT_LOADING,
    data: {
        confirmDeletingLoading: visible
    }
});