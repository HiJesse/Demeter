// user list actions
import {
    ACTION_CHANGE_SEARCH_INPUT,
    ACTION_CHANGE_SEARCH_INPUT_VISIBLE,
    ACTION_DELETE_USER,
    ACTION_FETCH_USER_LIST,
    ACTION_PAGE_LOADING
} from "../constants/actionType";

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