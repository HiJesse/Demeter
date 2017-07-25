//user reducer
import {
    ACTION_CLOSE_ALERT,
    ACTION_LOGIN,
    ACTION_MODIFY_PASSWORD,
    ACTION_MODIFY_PASSWORD_UID
} from "../constants/actionType";
import {RES_FAILED, RES_SUCCEED} from "../../util/status";

/**
 * 登录 reducer
 * @param state
 * @param action
 * @returns {*}
 */
function login(state, action) {
    let msg = null;
    if (action.status === RES_SUCCEED) {
        msg = '登录成功';
    } else {
        msg = action.msg;
    }
    return {
        ...state,
        alertMsg: true,
        loginStatus: action.status,
        loginMessage: msg,
        userInfo: action.data
    };
}

/**
 * 修改密码reducer
 * @param state
 * @param action
 */
function modifyPassword(state, action) {
    let msg = null;
    if (action.status === 0) {
        msg = '密码修改成功';
    } else {
        msg = action.msg;
    }

    return {
        ...state,
        alertMsg: true,
        modifyPasswordStatus: action.status,
        modifyPasswordMessage: msg
    };
}

const initialUserState = {
    alertMsg: false,
    loginStatus: RES_FAILED,
    loginMessage: null,
    modifyPasswordStatus: RES_FAILED,
    modifyPasswordMessage: null,
    userInfo: null
};

/**
 * user reducer模块分发
 * @param state
 * @param action
 * @returns {*}
 */
export function user(state = initialUserState, action) {
    let newState = state;
    switch (action.type) {
        case ACTION_LOGIN:
            newState = login(state, action.data);
            break;
        case ACTION_CLOSE_ALERT:
            newState = {
                ...state,
                alertMsg: false
            };
            break;
        case ACTION_MODIFY_PASSWORD:
        case ACTION_MODIFY_PASSWORD_UID:
            newState = modifyPassword(state, action.data);
            break;
    }
    return newState;
}