// home reducer
import {ACTION_COLLAPSE_MENU, ACTION_FILL_MENU_VALUES} from "../constants/actionType";



const initialHomeState = {
    alertMsg: false,
    isCollapsed: false,
    menuValue: null,
    menuValueIcon: null,
    subMenuValue: null
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
    }
    return newState;
}