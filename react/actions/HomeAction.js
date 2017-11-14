// home actions
import {ACTION_COLLAPSE_MENU, ACTION_FILL_MENU_VALUES, ACTION_FILL_PAGE_CONTENT} from "../constants/ActionType";
import {isStringEmpty} from "../../util/CheckerUtil";

/**
 * 菜单栏折叠
 * @param isCollapsed 是否折叠
 */
export const collapseMenuAction = isCollapsed => ({
    type: ACTION_COLLAPSE_MENU,
    data: {
        isCollapsed: isCollapsed
    }
});

/**
 * 菜单栏选中, 在内容部分显示菜单路径
 * @param val
 */
export const fillSelectedMenuValuesAction = val => ({
    type: ACTION_FILL_MENU_VALUES,
    data: {
        menuValue: val.value,
        menuValueIcon: val.icon,
        subMenuValue: val.subValue
    }
});

/**
 * 菜单栏选中, 根据菜单选中填充页面内容
 * @param val
 * @returns {{type, data: {pageContent}}}
 */
export const fillSelectedPageContentAction = val => {
    let pageContent = val.key;
    if (!isStringEmpty(val.subKey)) {
        pageContent = val.subKey;
    }
    return {
        type: ACTION_FILL_PAGE_CONTENT,
        data: {
            pageContent: pageContent
        }
    }
};