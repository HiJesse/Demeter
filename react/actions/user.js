// user actions
import {
    ACTION_CLOSE_ALERT,
    ACTION_GET_USER_INFO,
    ACTION_LOGIN,
    ACTION_MODIFY_PASSWORD,
    ACTION_MODIFY_PASSWORD_UID
} from "../constants/actionType";
import {actionGet} from "../../util/ajax";
import {URL_GET_USER_INFO, URL_LOGIN, URL_MODIFY_PWD} from "../constants/url";
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
 * 关闭弹窗action
 * @type {{type}}
 */
export const closeAlert = {
    type: ACTION_CLOSE_ALERT
};

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