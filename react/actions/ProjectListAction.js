// project list actions
import {
    ACTION_CHANGE_SEARCH_PROJECT_INPUT,
    ACTION_CHANGE_SEARCH_PROJECT_INPUT_VISIBLE,
    ACTION_DELETE_PROJECT,
    ACTION_DELETE_PROJECT_DIALOG_VISIBLE,
    ACTION_FETCH_JOINED_PROJECT_LIST,
    ACTION_FETCH_PROJECT_LIST,
    ACTION_PROJECT_PAGE_LOADING,
    ACTION_PROJECT_QUIT_PROJECT_DIALOG_VISIBLE,
    ACTION_PROJECT_USER_MANAGER_DIALOG_VISIBLE,
    ACTION_QUIT_PROJECT,
    ACTION_UPDATE_PROJECT_DIALOG_VISIBLE,
    ACTION_UPDATING_PROJECT_INFO
} from "../constants/ActionType";

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
 * 分页获取已经加入的项目列表
 * @param uId 当前uId
 * @param pageSize 一页容量
 * @param pageNum 页码
 */
export const fetchJoinedProjectListAction = (uId, pageSize, pageNum) => ({
    type: ACTION_FETCH_JOINED_PROJECT_LIST,
    data: {
        uId: uId,
        pageSize: pageSize,
        pageNum: pageNum,
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
 * 是否显示删除项目弹窗
 * @param visible
 */
export const showDeletingDialogAction = visible => ({
    type: ACTION_DELETE_PROJECT_DIALOG_VISIBLE,
    data: {
        deleteDialogVisible: visible
    }
});

/**
 * 是否项目用户管理弹窗
 * @param visible
 */
export const showUserManagerDialogAction = visible => ({
    type: ACTION_PROJECT_USER_MANAGER_DIALOG_VISIBLE,
    data: {
        userManagerDialogVisible: visible
    }
});

/**
 * 是否显示退出项目弹窗
 * @param visible
 * @param index 项目index
 */
export const showQuitingProjectDialogAction = (visible, index) => ({
    type: ACTION_PROJECT_QUIT_PROJECT_DIALOG_VISIBLE,
    data: {
        visible: visible,
        index: index
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

/**
 * 输入搜索项目变化
 * @param projectSearch
 * @returns {{type, data: {projectSearch: *}}}
 */
export const changeSearchInputAction = projectSearch => ({
    type: ACTION_CHANGE_SEARCH_PROJECT_INPUT,
    data: {
        projectSearch: projectSearch
    }
});

/**
 * 搜索框是否可见
 * @param visible
 * @returns {{type, data: {searchInputVisible: *}}}
 */
export const changeSearchVisibleAction = visible => ({
    type: ACTION_CHANGE_SEARCH_PROJECT_INPUT_VISIBLE,
    data: {
        searchInputVisible: visible
    }
});

/**
 * 退出项目
 * @param uId
 * @param projectId
 */
export const quitProjectAction = (uId, projectId) => ({
    type: ACTION_QUIT_PROJECT,
    data: {
        uId: uId,
        projectId: projectId
    }
});