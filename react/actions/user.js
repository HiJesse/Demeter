import {ACTION_CLOSE_ALERT, ACTION_LOGIN, ACTION_LOGOUT, ACTION_MODIFY_PASSWORD} from "../constants/actionType";
import {get} from "../../util/ajax";
import {URL_LOGIN, URL_LOGOUT, URL_MODIFY_PWD} from "../constants/url";
import {md5} from "../../util/encrypt";

/**
 * 登录action
 * @param dispatch
 * @param account
 * @param pwd
 */
export function login(dispatch, account, pwd) {
    const params = {
        "account": account,
        "password": md5(pwd)
    };

    let action = {
        type: ACTION_LOGIN
    };

    get(URL_LOGIN, params).then((data) => {
        action.data = data;
        dispatch(action)
    }).catch((e) => {
        action.data = e;
        dispatch(action);
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
    const params = {
        account: account,
        password: md5(pwd),
        newPassword: md5(newPwd)
    };
    let action = {
        type: ACTION_MODIFY_PASSWORD
    };

    get(URL_MODIFY_PWD, params).then((data) => {
        action.data = data;
        dispatch(action)
    }).catch((e) => {
        action.data = e;
        dispatch(action);
    });
}

export const logout = (account) => {
    console.log('account', account);
    const params = {
        account: account,
    };
    get(URL_LOGOUT, params).then((response) => {
        console.log('jesse', response)
    }).catch((e) => {

    });
    return {
        type: ACTION_LOGOUT,
        account: account,
        pwd: ''
    }
};