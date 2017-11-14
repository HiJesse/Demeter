// user list epics
import {combineEpics} from "redux-observable";
import {
    ACTION_ADMIN_UPDATE_USER_INFO,
    ACTION_ADMIN_UPDATE_USER_INFO_FULFILLED,
    ACTION_DELETE_USER,
    ACTION_DELETE_USER_FULFILLED,
    ACTION_FETCH_USER_LIST,
    ACTION_FETCH_USER_LIST_FULFILLED
} from "../constants/ActionType";
import {AJAX_METHOD, ajaxRequest} from "../../util/AjaxUtil";
import {URL_DELETE_USER, URL_FETCH_USER_LIST, URL_UPDATE_USER} from "../constants/Url";

/**
 * 获取用户列表 epic
 * @param action$
 */
export const fetchUserListEpic = action$ =>
    action$.ofType(ACTION_FETCH_USER_LIST)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_FETCH_USER_LIST_FULFILLED,
            method: AJAX_METHOD.GET,
            url: URL_FETCH_USER_LIST,
            params: action.data
        }));

/**
 * 删除用户 epic
 * @param action$
 */
export const deleteUserEpic = action$ =>
    action$.ofType(ACTION_DELETE_USER)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_DELETE_USER_FULFILLED,
            method: AJAX_METHOD.POST,
            url: URL_DELETE_USER,
            params: action.data
        }));

/**
 * 更新用户信息 epic
 * @param action$
 */
export const updateUserEpic = action$ =>
    action$.ofType(ACTION_ADMIN_UPDATE_USER_INFO)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_ADMIN_UPDATE_USER_INFO_FULFILLED,
            method: AJAX_METHOD.POST,
            url: URL_UPDATE_USER,
            params: action.data
        }));

/**
 * user list相关 epic方法汇总
 */
export const userManagerEpics = combineEpics(
    fetchUserListEpic,
    deleteUserEpic,
    updateUserEpic
);