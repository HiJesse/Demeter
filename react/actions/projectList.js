// project list actions
import {ACTION_FETCH_PROJECT_LIST, ACTION_PROJECT_PAGE_LOADING} from "../constants/actionType";

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