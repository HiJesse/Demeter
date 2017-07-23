// home actions
import {ACTION_COLLAPSE_MENU, ACTION_FILL_MENU_VALUES, ACTION_FILL_PAGE_CONTENT} from "../constants/actionType";
import {isStringEmpty} from "../../util/checker";


// 菜单栏折叠
export function collapseMenu(isCollapsed) {
    return {
        type: ACTION_COLLAPSE_MENU,
        data: {
            isCollapsed: isCollapsed
        }
    }
}

// 菜单栏选中, 在内容部分显示菜单路径
export function fillSelectedMenuValues(val) {
    let subValue = null;
    if (!isStringEmpty(val.subValue)) {
        subValue = val.subValue;
    }
    return {
        type: ACTION_FILL_MENU_VALUES,
        data: {
            menuValue: val.value,
            menuValueIcon: val.icon,
            subMenuValue: subValue
        }
    }
}

// 菜单栏选中, 根据菜单选中填充页面内容
export function fillSelectedPageContent(val) {
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
}