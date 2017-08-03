// user list actions
import {actionAjax, AJAX_METHOD} from "../../util/ajax";
import {
    ACTION_CHANGE_SEARCH_INPUT,
    ACTION_CHANGE_SEARCH_INPUT_VISIBLE, ACTION_DELETE_USER,
    ACTION_FETCH_USER_LIST,
    ACTION_PAGE_LOADING
} from "../constants/actionType";
import {URL_DELETE_USER, URL_FETCH_USER_LIST} from "../constants/url";

/**
 * 是否显示列表加载loading
 * @param dispatch
 * @param pageLoading 是否显示菊花
 */
export function loading(dispatch, pageLoading) {
    dispatch({
        type: ACTION_PAGE_LOADING,
        data: {
            pageLoading: pageLoading
        }
    });
}

/**
 * 分页获取用户列表
 * @param dispatch
 * @param uId
 * @param pageSize 一页多少用户
 * @param pageNum 获取第几页数据
 * @param accountSearch 根据账号模糊查询
 */
export function fetchUserList(dispatch, uId, pageSize, pageNum, accountSearch) {
    loading(dispatch, true);
    actionAjax(dispatch, ACTION_FETCH_USER_LIST, AJAX_METHOD.GET, URL_FETCH_USER_LIST, {
        uId: uId,
        pageSize: pageSize,
        pageNum: pageNum,
        accountSearch: accountSearch
    });
}

/**
 * 输入搜索账号变化
 * @param accountSearch
 * @returns {{type, data: {searchText: *}}}
 */
export function changeSearchInput(accountSearch) {
    return {
        type: ACTION_CHANGE_SEARCH_INPUT,
        data: {
            accountSearch: accountSearch
        }
    }
}

/**
 * 搜索框是否可见
 * @param visible
 * @returns {{type, data: {searchInputVisible: *}}}
 */
export function changeSearchVisible(visible) {
    return {
        type: ACTION_CHANGE_SEARCH_INPUT_VISIBLE,
        data: {
            searchInputVisible: visible
        }
    }
}

/**
 * 删除用户
 * @param dispatch
 * @param uId
 * @param account
 */
export function deleteUser(dispatch, uId, account) {
    actionAjax(dispatch, ACTION_DELETE_USER, AJAX_METHOD.POST, URL_DELETE_USER, {
        uId: uId,
        account: account
    });
}