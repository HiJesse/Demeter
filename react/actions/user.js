// user actions
import {
    ACTION_CREATE_USER,
    ACTION_GET_USER_INFO,
    ACTION_LOGIN,
    ACTION_MODIFY_PASSWORD,
    ACTION_MODIFY_PASSWORD_UID,
    ACTION_RESET_PASSWORD,
    ACTION_UPDATE_USER_INFO
} from "../constants/actionType";
import {actionAjax, AJAX_METHOD} from "../../util/ajax";
import {
    URL_CREATE_USER,
    URL_GET_USER_INFO,
    URL_LOGIN,
    URL_MODIFY_PWD,
    URL_RESET_PASSWORD,
    URL_UPDATE_USER_INFO
} from "../constants/url";
import {md5} from "../../util/encrypt";

/**
 * 登录action
 * @param dispatch
 * @param account
 * @param pwd
 */
export function login(dispatch, account, pwd) {
    actionAjax(dispatch, ACTION_LOGIN, AJAX_METHOD.POST, URL_LOGIN, {
        "account": account,
        "password": md5(pwd)
    });
}

/**
 * 修改密码action
 * @param dispatch
 * @param account
 * @param pwd
 * @param newPwd
 */
export function modifyPassword(dispatch, account, pwd, newPwd) {
    actionAjax(dispatch, ACTION_MODIFY_PASSWORD, AJAX_METHOD.POST, URL_MODIFY_PWD, {
        account: account,
        password: md5(pwd),
        newPassword: md5(newPwd)
    });
}

/**
 * 根据uId获取用户信息
 * @param dispatch
 * @param uId
 */
export function getUserInfo(dispatch, uId) {
    actionAjax(dispatch, ACTION_GET_USER_INFO, AJAX_METHOD.GET, URL_GET_USER_INFO, {
        uId: uId,
    });
}

/**
 * 根据uId和老密码修改新密码
 * @param dispatch
 * @param uId
 * @param pwd
 * @param newPwd
 */
export function modifyPasswordById(dispatch, uId, pwd, newPwd) {
    actionAjax(dispatch, ACTION_MODIFY_PASSWORD_UID, AJAX_METHOD.POST, URL_MODIFY_PWD, {
        uId: uId,
        password: md5(pwd),
        newPassword: md5(newPwd)
    });
}

/**
 * 根据uId更新用户基本信息
 * @param dispatch
 * @param uId
 * @param nickName
 */
export function updateUserInfo(dispatch, uId, nickName) {
    actionAjax(dispatch, ACTION_UPDATE_USER_INFO, AJAX_METHOD.POST, URL_UPDATE_USER_INFO, {
        uId: uId,
        nickName: nickName
    });
}

/**
 * 创建新用户
 * @param dispatch
 * @param account
 * @param uId
 */
export function createUser(dispatch, account, uId) {
    actionAjax(dispatch, ACTION_CREATE_USER, AJAX_METHOD.POST, URL_CREATE_USER, {
        account: account,
        uId: uId
    });
}

/**
 * 重置用户密码
 * @param dispatch
 * @param account
 * @param uId
 */
export function resetPassword(dispatch, account, uId) {
    actionAjax(dispatch, ACTION_RESET_PASSWORD, AJAX_METHOD.POST, URL_RESET_PASSWORD, {
        account: account,
        uId: uId
    });
}