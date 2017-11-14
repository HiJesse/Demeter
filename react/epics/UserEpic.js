// user epics
import {combineEpics} from "redux-observable";
import {
    ACTION_CREATE_USER,
    ACTION_CREATE_USER_FULFILLED,
    ACTION_GET_USER_INFO,
    ACTION_GET_USER_INFO_FULFILLED,
    ACTION_LOGIN,
    ACTION_LOGIN_FULFILLED,
    ACTION_MODIFY_PASSWORD,
    ACTION_MODIFY_PASSWORD_FULFILLED,
    ACTION_MODIFY_PASSWORD_UID,
    ACTION_MODIFY_PASSWORD_UID_FULFILLED,
    ACTION_RESET_PASSWORD,
    ACTION_RESET_PASSWORD_FULFILLED,
    ACTION_UPDATE_USER_INFO,
    ACTION_UPDATE_USER_INFO_FULFILLED
} from "../constants/ActionType";
import {AJAX_METHOD, ajaxRequest} from "../../util/AjaxUtil";
import {
    URL_CREATE_USER,
    URL_GET_USER_INFO,
    URL_LOGIN,
    URL_MODIFY_PWD,
    URL_RESET_PASSWORD,
    URL_UPDATE_USER_INFO
} from "../constants/Url";

/**
 * 登录 epic
 * @param action$
 */
export const loginEpic = action$ =>
    action$.ofType(ACTION_LOGIN)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_LOGIN_FULFILLED,
            method: AJAX_METHOD.POST,
            url: URL_LOGIN,
            params: action.data
        }));

/**
 * 未登录修改密码 epic
 * @param action$
 */
export const modifyPasswordEpic = action$ =>
    action$.ofType(ACTION_MODIFY_PASSWORD)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_MODIFY_PASSWORD_FULFILLED,
            method: AJAX_METHOD.POST,
            url: URL_MODIFY_PWD,
            params: action.data
        }));

/**
 * 获取用户信息 epic
 * @param action$
 */
export const getUserInfoEpic = action$ =>
    action$.ofType(ACTION_GET_USER_INFO)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_GET_USER_INFO_FULFILLED,
            method: AJAX_METHOD.GET,
            url: URL_GET_USER_INFO,
            params: action.data
        }));

/**
 * 登录后修改密码 epic
 * @param action$
 */
export const modifyPasswordByIdEpic = action$ =>
    action$.ofType(ACTION_MODIFY_PASSWORD_UID)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_MODIFY_PASSWORD_UID_FULFILLED,
            method: AJAX_METHOD.POST,
            url: URL_MODIFY_PWD,
            params: action.data
        }));

/**
 * 更新用户信息 epic
 * @param action$
 */
export const updateUserInfoEpic = action$ =>
    action$.ofType(ACTION_UPDATE_USER_INFO)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_UPDATE_USER_INFO_FULFILLED,
            method: AJAX_METHOD.POST,
            url: URL_UPDATE_USER_INFO,
            params: action.data
        }));

/**
 * 新建用户 epic
 * @param action$
 */
export const createUserEpic = action$ =>
    action$.ofType(ACTION_CREATE_USER)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_CREATE_USER_FULFILLED,
            method: AJAX_METHOD.POST,
            url: URL_CREATE_USER,
            params: action.data
        }));

/**
 * 重置密码 epic
 * @param action$
 */
export const resetPasswordEpic = action$ =>
    action$.ofType(ACTION_RESET_PASSWORD)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_RESET_PASSWORD_FULFILLED,
            method: AJAX_METHOD.POST,
            url: URL_RESET_PASSWORD,
            params: action.data
        }));


/**
 * user 相关 epic方法汇总
 */
export const userEpics = combineEpics(
    loginEpic,
    modifyPasswordEpic,
    getUserInfoEpic,
    modifyPasswordByIdEpic,
    updateUserInfoEpic,
    createUserEpic,
    resetPasswordEpic
);