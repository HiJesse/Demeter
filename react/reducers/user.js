//user reducer
import {CLOSE_ALERT, LOGIN} from "../constants/action_type";
import {RES_FAILED} from "../../util/status";

/**
 * 登录 reducer
 * @param state
 * @param action
 * @returns {*}
 */
function login(state, action) {
    let msg = null;
    if (action.status === 0) {
        msg = '登录成功';
    } else {
        msg = action.msg;
    }

    return {
        ...state,
        alertMsg: true,
        loginStatus: action.status,
        loginMessage: msg
    };
}

const initialUserState = {
    alertMsg: false,
    loginStatus: RES_FAILED,
    loginMessage: null
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
        case LOGIN:
             newState = login(state, action.data);
            break;
        case CLOSE_ALERT:
            newState = {
                ...state,
                alertMsg: false,
                loginStatus: RES_FAILED,
                loginMessage: null
            };
            break;
    }
    return newState;
}