// project list actions
import {ACTION_PROJECT_PAGE_LOADING} from "../constants/actionType";

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