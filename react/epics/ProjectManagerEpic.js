// project manager epics
import {combineEpics} from "redux-observable";
import {
    ACTION_CREATE_PROJECT,
    ACTION_CREATE_PROJECT_FULFILLED,
    ACTION_DELETE_PROJECT,
    ACTION_DELETE_PROJECT_FULFILLED,
    ACTION_FETCH_JOINED_PROJECT_LIST,
    ACTION_FETCH_JOINED_PROJECT_LIST_FULFILLED,
    ACTION_FETCH_PROJECT_LIST,
    ACTION_FETCH_PROJECT_LIST_FULFILLED,
    ACTION_UPDATE_PROJECT_INFO,
    ACTION_UPDATE_PROJECT_INFO_FULFILLED
} from "../constants/ActionType";
import {AJAX_METHOD, ajaxRequest} from "../../util/AjaxUtil";
import {
    URL_CREATE_PROJECT,
    URL_DELETE_PROJECT,
    URL_FETCH_JOINED_PROJECT_LIST,
    URL_FETCH_PROJECT_LIST,
    URL_UPDATE_PROJECT_INFO
} from "../constants/Url";

/**
 * 创建项目epic
 * @param action$
 */
export const createProjectEpic = action$ =>
    action$.ofType(ACTION_CREATE_PROJECT)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_CREATE_PROJECT_FULFILLED,
            method: AJAX_METHOD.POST_MULTI_FORM,
            url: URL_CREATE_PROJECT,
            params: action.data
        }));

/**
 * 获取项目列表epic
 * @param action$
 */
export const fetchProjectListEpic = action$ =>
    action$.ofType(ACTION_FETCH_PROJECT_LIST)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_FETCH_PROJECT_LIST_FULFILLED,
            method: AJAX_METHOD.GET,
            url: URL_FETCH_PROJECT_LIST,
            params: action.data
        }));

/**
 * 获取用户已经加入的项目列表epic
 * @param action$
 */
export const fetchJoinedProjectListEpic = action$ =>
    action$.ofType(ACTION_FETCH_JOINED_PROJECT_LIST)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_FETCH_JOINED_PROJECT_LIST_FULFILLED,
            method: AJAX_METHOD.GET,
            url: URL_FETCH_JOINED_PROJECT_LIST,
            params: action.data
        }));

/**
 * 更新项目信息epic
 * @param action$
 */
export const updateProjectInfoEpic = action$ =>
    action$.ofType(ACTION_UPDATE_PROJECT_INFO)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_UPDATE_PROJECT_INFO_FULFILLED,
            method: AJAX_METHOD.POST_MULTI_FORM,
            url: URL_UPDATE_PROJECT_INFO,
            params: action.data
        }));

/**
 * 删除项目epic
 * @param action$
 */
export const deleteProjectInfoEpic = action$ =>
    action$.ofType(ACTION_DELETE_PROJECT)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_DELETE_PROJECT_FULFILLED,
            method: AJAX_METHOD.POST,
            url: URL_DELETE_PROJECT,
            params: action.data
        }));

/**
 * user list相关 epic方法汇总
 */
export const projectManagerEpics = combineEpics(
    createProjectEpic,
    fetchProjectListEpic,
    fetchJoinedProjectListEpic,
    updateProjectInfoEpic,
    deleteProjectInfoEpic
);