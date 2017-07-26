//user reducer
import {message} from "antd";
import {
    ACTION_GET_USER_INFO,
    ACTION_LOGIN,
    ACTION_MODIFY_PASSWORD,
    ACTION_MODIFY_PASSWORD_UID,
    ACTION_UPDATE_USER_INFO
} from "../constants/actionType";
import {RES_FAILED, RES_SUCCEED} from "../../util/status";

/**
 * 登录 reducer
 * @param state
 * @param action
 * @returns {*}
 */
function login(state, action) {
    if (action.status === RES_SUCCEED) {
        message.success('登录成功');
    } else {
        message.error(action.msg);
    }

    return {
        ...state,
        loginStatus: action.status,
        uId: action.data.uId,
        token: action.data.token
    };
}

/**
 * 修改密码reducer
 * @param state
 * @param action
 */
function modifyPassword(state, action) {
    if (action.status === RES_SUCCEED) {
        message.success('密码修改成功');
    } else {
        message.error(action.msg);
    }

    return {
        ...state,
        modifyPasswordStatus: action.status,
    };
}

/**
 * 登录状态下修改密码
 * @param state
 * @param action
 */
function modifyPasswordById(state, action) {
    if (action.status === RES_SUCCEED) {
        message.success('密码修改成功', 1.5, () => location.reload());
    } else {
        message.error(action.msg);
    }

    return {
        ...state
    };
}

/**
 * 获取用户信息
 * @param state
 * @param action
 */
function getUserInfo(state, action) {
    const succeed = action.status === RES_SUCCEED;
    if (!succeed) {
        message.error(action.msg);
    }

    return {
        ...state,
        isLogin: succeed,
        isAdmin: succeed ? action.data.isAdmin : false,
        nickName: succeed ? action.data.nickName : null,
        account: succeed ? action.data.account : null,
    };
}

/**
 * 更新用户基本信息
 * @param state
 * @param action
 */
function updateUserInfo(state, action) {
    if (action.status === RES_SUCCEED) {
        message.success('更新成功', 1.5, () => location.reload());
    } else {
        message.error(action.msg);
    }

    return {
        ...state,
    };
}

const initialUserState = {
    loginStatus: RES_FAILED,
    modifyPasswordStatus: RES_FAILED,
    uId: null,
    token: null,
    isAdmin: false,
    nickName: null,
    account: null
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
        case ACTION_MODIFY_PASSWORD:
            newState = modifyPassword(state, action.data);
            break;
        case ACTION_MODIFY_PASSWORD_UID:
            newState = modifyPasswordById(state, action.data);
            break;
        case ACTION_GET_USER_INFO:
            newState = getUserInfo(state, action.data);
            break;
        case ACTION_UPDATE_USER_INFO:
            newState = updateUserInfo(state, action.data);
            break;
    }
    return newState;
}