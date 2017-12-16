//user reducer
import {message} from "antd";
import {
    ACTION_CREATE_USER_FULFILLED,
    ACTION_GET_USER_INFO_FULFILLED,
    ACTION_LOGIN_FULFILLED,
    ACTION_MODIFY_PASSWORD_FULFILLED,
    ACTION_MODIFY_PASSWORD_UID_FULFILLED,
    ACTION_RESET_PASSWORD_FULFILLED,
    ACTION_UPDATE_USER_INFO_FULFILLED
} from "../constants/ActionType";
import {RES_FAILED, RES_SUCCEED} from "../../api/status/Status";

/**
 * 登录 reducer
 * @param state
 * @param action
 * @returns {*}
 */
function loginReducer(state, action) {
    if (action.status === RES_SUCCEED) {
        message.success('登录成功');
    } else {
        message.error(action.msg);
    }
    
    return {
        ...state,
        loginStatus: action.status,
        uId: action.data.uId,
        token: action.data.token,
        isAdmin: action.data.isAdmin,
    };
}

/**
 * 修改密码reducer
 * @param state
 * @param action
 */
function modifyPasswordReducer(state, action) {
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
function modifyPasswordByIdReducer(state, action) {
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
function getUserInfoReducer(state, action) {
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
function updateUserInfoReducer(state, action) {
    if (action.status === RES_SUCCEED) {
        message.success('更新成功', 1.5, () => location.reload());
    } else {
        message.error(action.msg);
    }

    return {
        ...state,
    };
}

/**
 * 创建用户
 * @param state
 * @param action
 */
function createUserReducer(state, action) {
    if (action.status === RES_SUCCEED) {
        message.success('创建成功');
    } else {
        message.error(action.msg);
    }

    return {
        ...state,
    };
}

/**
 * 重置密码
 * @param state
 * @param action
 */
function resetPasswordReducer(state, action) {
    if (action.status === RES_SUCCEED) {
        message.success('重置密码成功');
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
    account: null,
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
        case ACTION_LOGIN_FULFILLED:
            newState = loginReducer(state, action.data);
            break;
        case ACTION_MODIFY_PASSWORD_FULFILLED:
            newState = modifyPasswordReducer(state, action.data);
            break;
        case ACTION_MODIFY_PASSWORD_UID_FULFILLED:
            newState = modifyPasswordByIdReducer(state, action.data);
            break;
        case ACTION_GET_USER_INFO_FULFILLED:
            newState = getUserInfoReducer(state, action.data);
            break;
        case ACTION_UPDATE_USER_INFO_FULFILLED:
            newState = updateUserInfoReducer(state, action.data);
            break;
        case ACTION_CREATE_USER_FULFILLED:
            newState = createUserReducer(state, action.data);
            break;
        case ACTION_RESET_PASSWORD_FULFILLED:
            newState = resetPasswordReducer(state, action.data);
            break;
        default:

    }
    return newState;
}