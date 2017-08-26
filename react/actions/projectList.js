// project list actions
import {
    ACTION_DELETE_PROJECT,
    ACTION_FETCH_PROJECT_LIST,
    ACTION_PROJECT_PAGE_LOADING,
    ACTION_UPDATE_PROJECT_DIALOG_VISIBLE,
    ACTION_UPDATING_PROJECT_INFO
} from "../constants/actionType";

/**
 * 是否显示项目列表加载loading
 * @param pageLoading 是否显示菊花
 */
export const projectPageLoadingAction = pageLoading => ({
    type: ACTION_PROJECT_PAGE_LOADING,
    data: {
        pageLoading: pageLoading
    }
});

/**
 * 分页获取项目列表
 * @param uId 当前uId
 * @param pageSize 一页容量
 * @param pageNum 页码
 * @param projectName 项目名称模糊匹配
 */
export const fetchProjectListAction = (uId, pageSize, pageNum, projectName) => ({
    type: ACTION_FETCH_PROJECT_LIST,
    data: {
        uId: uId,
        pageSize: pageSize,
        pageNum: pageNum,
        projectName: projectName
    }
});

/**
 * 是否显示更新项目信息弹窗
 * @param visible
 */
export const showUpdateDialogAction = visible => ({
    type: ACTION_UPDATE_PROJECT_DIALOG_VISIBLE,
    data: {
        updateDialogVisible: visible
    }
});

/**
 * 设置要更新的项目信息
 * @param index
 */
export const setUpdatingProjectInfoAction = index => ({
    type: ACTION_UPDATING_PROJECT_INFO,
    data: {
        updateProjectIndex: index
    }
});

/**
 * 根据项目列表index 删除该index的项目
 * @param uId
 * @param projectId
 */
export const deleteProjectAction = (uId, projectId) => ({
    type: ACTION_DELETE_PROJECT,
    data: {
        uId: uId,
        projectId: projectId
    }
});