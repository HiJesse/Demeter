import {LOGIN} from "../constants/action_type";
import {get, post} from "../../util/ajax";
import {URL_LOGIN, URL_LOGOUT} from "../constants/url";

export const login = (account, pwd) => {
    const params = {
        "account": account,
        "password": pwd
    };
    console.log(params);
    get(URL_LOGIN, params).then((data) => {
        console.log('jesse succeed', data)
    }).catch((e) => {
        console.log('jesse', e);
    });
    return {
        type: LOGIN,
        account: account,
        pwd: pwd
    }
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