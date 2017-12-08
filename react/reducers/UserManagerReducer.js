//user list reducer
import {message} from "antd";
import {
    ACTION_ADMIN_UPDATE_USER_INFO_FULFILLED,
    ACTION_CHANGE_SEARCH_INPUT,
    ACTION_CHANGE_SEARCH_INPUT_VISIBLE,
    ACTION_DELETE_USER_FULFILLED,
    ACTION_FETCH_USER_LIST_FULFILLED,
    ACTION_PAGE_LOADING,
    ACTION_UPDATE_USER_DIALOG_VISIBLE,
    ACTION_UPDATE_USER_INFO_LOADING,
    ACTION_UPDATE_USER_NICKNAME,
    ACTION_UPDATING_USER_INFO
} from "../constants/ActionType";
import {RES_SUCCEED} from "../../api/status/Status";


/**
 * 获取用户列表
 * @param state
 * @param action
 */
function fetchUserListReducer(state, action) {
    const succeed = action.status === RES_SUCCEED;
    if (!succeed) {
        message.error(action.msg);
        return {
            ...state,
            userList: [],
            pageLoading: false,
            needRefreshData: false
        };
    }

    const userList = action.data.userList.map(function (item, index) {
        return {
            key: index,
            account: item.account,
            nickname: item.nickName,
            auth: item.admin ? '管理员' : '普通用户',
        };
    });

    return {
        ...state,
        userList: userList,
        userCount: action.data.userCount,
        pageNum: action.data.pageNum,
        pageLoading: false,
        needRefreshData: false
    };
}

/**
 * 删除用户, 成功的话则刷新table数据
 * @param state
 * @param action
 * @returns {*}
 */
function deleteUserReducer(state, action) {
    const succeed = action.status === RES_SUCCEED;
    if (!succeed) {
        message.error(action.msg);
        return {
            ...state
        };
    }
    return {
        ...state,
        needRefreshData: true
    };
}

/**
 * 更新用户信息
 * @param state
 * @param action
 */
const updateUserInfoReducer = (state, action) => {
    if (action.status === RES_SUCCEED) {
        message.success('更新用户信息成功');
    } else {
        message.error(action.msg);
    }

    return {
        ...state,
        confirmUpdatingUserInfoLoading: false
    };
};

/**
 * 获取当前选中要更新的用户的信息
 * @param state
 * @param action
 * @returns {{updateUserInfo: {}}}
 */
const setUpdatingUserInfoReducer = (state, action) => {
    const index = action.updateUserIndex;
    let updateUserInfo = {};

    if (index >= 0 && state.userList.length > index) {
        const info = state.userList[index];
        updateUserInfo.account = info.account;
        updateUserInfo.nickname = info.nickname;
    }

    return {
        ...state,
        updateUserInfo: updateUserInfo
    }
};

const initialUserListState = {
    userCount: 0,
    userList: [],
    pageNum: 1,
    pageSize: 10,
    pageLoading: false,
    accountSearch: null,
    searchInputVisible: false,
    needRefreshData: false,
    updateDialogVisible: false,
    updateUserInfo: {},
    confirmUpdatingUserInfoLoading: -1,
    nickname: '',
};

/**
 * user reducer模块分发
 * @param state
 * @param action
 * @returns {*}
 */
export function userManager(state = initialUserListState, action) {
    let newState = state;
    switch (action.type) {
        case ACTION_FETCH_USER_LIST_FULFILLED:
            newState = fetchUserListReducer(state, action.data);
            break;
        case ACTION_PAGE_LOADING:
            newState = {
                ...state,
                pageLoading: action.data.pageLoading
            };
            break;
        case ACTION_CHANGE_SEARCH_INPUT:
            newState = {
                ...state,
                accountSearch: action.data.accountSearch
            };
            break;
        case ACTION_CHANGE_SEARCH_INPUT_VISIBLE:
            newState = {
                ...state,
                searchInputVisible: action.data.searchInputVisible
            };
            break;
        case ACTION_DELETE_USER_FULFILLED:
            newState = deleteUserReducer(state, action.data);
            break;
        case ACTION_UPDATE_USER_DIALOG_VISIBLE:
            newState = {
                ...state,
                updateDialogVisible: action.data.updateDialogVisible
            };
            break;
        case ACTION_UPDATING_USER_INFO:
            newState = setUpdatingUserInfoReducer(state, action.data);
            break;
        case ACTION_UPDATE_USER_INFO_LOADING:
            newState = {
                ...state,
                confirmUpdatingUserInfoLoading: action.data.confirmUpdatingUserInfoLoading
            };
            break;
        case ACTION_UPDATE_USER_NICKNAME:
            newState = {
                ...state,
                nickname: action.data.nickname
            };
            break;
        case ACTION_ADMIN_UPDATE_USER_INFO_FULFILLED:
            newState = updateUserInfoReducer(state, action.data);
            break;
        default:
    }
    return newState;
}