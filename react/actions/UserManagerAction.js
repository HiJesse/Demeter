// user list actions
import {
    ACTION_ADMIN_UPDATE_USER_INFO,
    ACTION_CHANGE_SEARCH_INPUT,
    ACTION_CHANGE_SEARCH_INPUT_VISIBLE,
    ACTION_DELETE_USER,
    ACTION_FETCH_USER_LIST,
    ACTION_PAGE_LOADING,
    ACTION_UPDATE_USER_DIALOG_VISIBLE,
    ACTION_UPDATE_USER_INFO_LOADING,
    ACTION_UPDATE_USER_NICKNAME,
    ACTION_UPDATING_USER_INFO
} from "../constants/ActionType";

/**
 * 是否显示列表加载loading
 * @param pageLoading 是否显示菊花
 */
export const pageLoadingAction = pageLoading => ({
    type: ACTION_PAGE_LOADING,
    data: {
        pageLoading: pageLoading
    }
});

/**
 * 分页获取用户列表
 * @param uId
 * @param pageSize 一页多少用户
 * @param pageNum 获取第几页数据
 * @param accountSearch 根据账号模糊查询
 */
export const fetchUserListAction = (uId, pageSize, pageNum, accountSearch) => ({
    type: ACTION_FETCH_USER_LIST,
    data: {
        uId: uId,
        pageSize: pageSize,
        pageNum: pageNum,
        accountSearch: accountSearch
    }
});

/**
 * 输入搜索账号变化
 * @param accountSearch
 * @returns {{type, data: {searchText: *}}}
 */
export const changeSearchInputAction = accountSearch => ({
    type: ACTION_CHANGE_SEARCH_INPUT,
    data: {
        accountSearch: accountSearch
    }
});

/**
 * 搜索框是否可见
 * @param visible
 * @returns {{type, data: {searchInputVisible: *}}}
 */
export const changeSearchVisibleAction = visible => ({
    type: ACTION_CHANGE_SEARCH_INPUT_VISIBLE,
    data: {
        searchInputVisible: visible
    }
});

/**
 * 删除用户
 * @param uId
 * @param account
 */
export const deleteUserAction = (uId, account) => ({
    type: ACTION_DELETE_USER,
    data: {
        uId: uId,
        account: account
    }
});


/**
 * 是否显示用户信息更新弹窗
 * @param visible
 */
export const showUpdatingUserDialogAction = visible => ({
    type: ACTION_UPDATE_USER_DIALOG_VISIBLE,
    data: {
        updateDialogVisible: visible
    }
});

/**
 * 设置要更新的用户信息
 * @param index 列表index
 */
export const setUpdatingUserInfoAction = index => ({
    type: ACTION_UPDATING_USER_INFO,
    data: {
        updateUserIndex: index
    }
});

/**
 * 更新用户信息弹窗信息时菊花状态
 * @param visible
 */
export const updateUserInfoLoadingAction = visible => ({
    type: ACTION_UPDATE_USER_INFO_LOADING,
    data: {
        confirmUpdatingUserInfoLoading: visible
    }
});

/**
 * 更新用户昵称, 只是view
 * @param nickname
 */
export const updateUserNicknameAction = nickname => ({
    type: ACTION_UPDATE_USER_NICKNAME,
    data: {
        nickname: nickname
    }
});

/**
 * 更新用户昵称
 * @param params
 */
export const updateUserInfoAction = params => ({
    type: ACTION_ADMIN_UPDATE_USER_INFO,
    data: params
});