// home reducer
import {ACTION_COLLAPSE_MENU, ACTION_FILL_MENU_VALUES, ACTION_FILL_PAGE_CONTENT} from "../constants/ActionType";

const initialHomeState = {
    isCollapsed: false, // 是否折叠菜单
    menuValue: null, // 选中菜单内容- 例如用户中心
    menuValueIcon: null, // 选中菜单图标
    subMenuValue: null, // 选中子菜单内容- 例如用户列表
    pageContent: null, // 主页内容标识
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
                ...state,
                isCollapsed: action.data.isCollapsed
            };
            break;
        case ACTION_FILL_MENU_VALUES:
            newState = {
                ...state,
                menuValue: action.data.menuValue,
                menuValueIcon: action.data.menuValueIcon,
                subMenuValue: action.data.subMenuValue
            };
            break;
        case ACTION_FILL_PAGE_CONTENT:
            newState = {
                ...state,
                pageContent: action.data.pageContent
            };
            break;
        default:
    }
    return newState;
}