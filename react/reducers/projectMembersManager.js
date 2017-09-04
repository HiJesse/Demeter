//project user manager reducer
import {message} from "antd";
import {
    ACTION_PROJECT_USER_ADD_ACCOUNT,
    ACTION_PROJECT_USER_ADD_ACCOUNT_FULFILLED,
    ACTION_PROJECT_USER_MANAGER_CHANGE_ACCOUNT
} from "../constants/actionType";
import {isStringEmpty} from "../../util/checker";
import {RES_SUCCEED} from "../../util/status";

/**
 * 添加用户, 校验数据是否合法
 * @param state
 * @param action
 * @returns {{}}
 */
const addMemberReducer = (state, action) => {
    const addedAccount = state.addedAccount;
    const projectId = action.projectId;
    const returnData = {...state};

    if (isStringEmpty(addedAccount) || addedAccount.length < 3) {
        message.error('用户账号最少为3个字符');
        return returnData;
    }

    if (isStringEmpty(projectId)) {
        message.error('项目信息无效, 请刷新重试');
        return returnData;
    }

    return {
        ...state,
        addUserLoading: true
    };
};

/**
 * 添加项目成员回调 reducer
 * @param state
 * @param action
 * @returns {{addUserLoading: boolean}}
 */
const addMemberFulfilledReducer = (state, action) => {
    if (action.status === RES_SUCCEED) {
        message.success('添加项目成员成功');
    } else {
        message.error(action.msg);
    }

    return {
        ...state,
        addUserLoading: false
    };
};

const initialProjectUserManagerState = {
    addUserLoading: false,
    addedAccount: null,
};

/**
 * project user manager模块分发
 * @param state
 * @param action
 * @returns {*}
 */
export function projectMembersManager(state = initialProjectUserManagerState, action) {
    let newState = state;

    switch (action.type) {
        case ACTION_PROJECT_USER_MANAGER_CHANGE_ACCOUNT:
            newState = {
                ...state,
                addedAccount: action.data.addedAccount
            };
            break;
        case ACTION_PROJECT_USER_ADD_ACCOUNT:
            newState = addMemberReducer(state, action.data);
            break;
        case ACTION_PROJECT_USER_ADD_ACCOUNT_FULFILLED:
            newState = addMemberFulfilledReducer(state, action.data);
            break;
        default:
    }
    return newState;
}