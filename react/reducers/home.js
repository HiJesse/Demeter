// home reducer
import {
    ACTION_COLLAPSE_MENU, ACTION_FILL_MENU_VALUES, ACTION_FILL_PAGE_CONTENT,
    ACTION_GET_USER_INFO
} from "../constants/actionType";
import {RES_SUCCEED} from "../../util/status";
import {isStringEmpty} from "../../util/checker";

/**
 * 获取用户信息
 * @param state
 * @param action
 */
function getUserInfo(state, action) {
    let msg = null;
    if (action.status !== RES_SUCCEED) {
        msg = action.msg;
    }

    return {
        ...state,
        alertMsg: !isStringEmpty(msg),
        errorMsg: msg,
        isLogin: isStringEmpty(msg),
        isAdmin: isStringEmpty(msg) ? action.data.isAdmin : false,
        nickName: isStringEmpty(msg) ? action.data.nickName : null,
    };
}

const initialHomeState = {
    alertMsg: false, // 是否弹窗
    errorMsg: null, // 错误提示信息
    isCollapsed: false, // 是否折叠菜单
    menuValue: null, // 选中菜单内容- 例如用户中心
    menuValueIcon: null, // 选中菜单图标
    subMenuValue: null, // 选中子菜单内容- 例如用户列表
    nickName: null, // 当前登录用户昵称
    isAdmin: false, // 当前用户是否是管理员
    isLogin: true, // 是否登录
    pageContent: null // 主页内容标识
};

/**
 * home reducer模块分发
 * @param state
 * @param action
 * @returns {*}
 */
export function home(state = initialHomeState, action) {
    let newState = state;
    switch (action.type) {
        case ACTION_COLLAPSE_MENU:
            newState = {
                ... state,
                isCollapsed: action.data.isCollapsed
            };
            break;
        case ACTION_FILL_MENU_VALUES:
            newState = {
                ... state,
                menuValue: action.data.menuValue,
                menuValueIcon: action.data.menuValueIcon,
                subMenuValue: action.data.subMenuValue
            };
            break;
        case ACTION_GET_USER_INFO:
            newState = getUserInfo(state, action.data);
            break;
        case ACTION_FILL_PAGE_CONTENT:
            newState = {
                ... state,
                pageContent: action.data.pageContent
            }
    }
    return newState;
}