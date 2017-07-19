import {CLOSE_ALERT, LOGIN} from "../constants/action_type";
import {get, post} from "../../util/ajax";
import {URL_LOGIN, URL_LOGOUT} from "../constants/url";
import {md5} from "../../util/encrypt";

export function login(dispatch, account, pwd) {
    const params = {
        "account": account,
        "password": md5(pwd)
    };

    let action = {
        type: LOGIN
    };

    get(URL_LOGIN, params).then((data) => {
        action.data = data;
        dispatch(action)
    }).catch((e) => {
        action.data = e;
        dispatch(action);
    });
}

export const closeAlert = {
    type: CLOSE_ALERT
};

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
        type: LOGIN,
        account: account,
        pwd: ''
    }
};