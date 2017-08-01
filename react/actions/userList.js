// user list actions
import {actionAjax, AJAX_METHOD} from "../../util/ajax";
import {
    ACTION_CHANGE_SEARCH_INPUT,
    ACTION_CHANGE_SEARCH_INPUT_VISIBLE,
    ACTION_FETCH_USER_LIST,
    ACTION_PAGE_LOADING
} from "../constants/actionType";
import {URL_FETCH_USER_LIST} from "../constants/url";

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
 */
export function fetchUserList(dispatch, uId, pageSize, pageNum) {
    loading(dispatch, true);
    actionAjax(dispatch, ACTION_FETCH_USER_LIST, AJAX_METHOD.GET, URL_FETCH_USER_LIST, {
        uId: uId,
        pageSize: pageSize,
        pageNum: pageNum
    });
}

/**
 * 输入搜索昵称变化
 * @param nicknameSearch
 * @returns {{type, data: {searchText: *}}}
 */
export function changeSearchInput(nicknameSearch) {
    return {
        type: ACTION_CHANGE_SEARCH_INPUT,
        data: {
            nicknameSearch: nicknameSearch
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