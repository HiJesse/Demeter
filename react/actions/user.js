// user actions
import {
    ACTION_CREATE_USER,
    ACTION_GET_USER_INFO,
    ACTION_LOGIN,
    ACTION_MODIFY_PASSWORD,
    ACTION_MODIFY_PASSWORD_UID,
    ACTION_UPDATE_USER_INFO
} from "../constants/actionType";
import {actionGet} from "../../util/ajax";
import {URL_CREATE_USER, URL_GET_USER_INFO, URL_LOGIN, URL_MODIFY_PWD, URL_UPDATE_USER_INFO} from "../constants/url";
import {md5} from "../../util/encrypt";

/**
 * 登录action
 * @param dispatch
 * @param account
 * @param pwd
 */
export function login(dispatch, account, pwd) {
    actionGet(dispatch, ACTION_LOGIN, URL_LOGIN, {
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
    actionGet(dispatch, ACTION_MODIFY_PASSWORD, URL_MODIFY_PWD, {
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
    actionGet(dispatch, ACTION_GET_USER_INFO, URL_GET_USER_INFO, {
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
    actionGet(dispatch, ACTION_MODIFY_PASSWORD_UID, URL_MODIFY_PWD, {
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
    actionGet(dispatch, ACTION_UPDATE_USER_INFO, URL_UPDATE_USER_INFO, {
        uId: uId,
        nickName: nickName
    });
}

/**
 * 创建新用户
 * @param dispatch
 * @param uId
 * @param nickName
 */
export function createUser(dispatch, account) {
    actionGet(dispatch, ACTION_CREATE_USER, URL_CREATE_USER, {
        account: account,
    });
}