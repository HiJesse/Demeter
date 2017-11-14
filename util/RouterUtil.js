// go to util
import {ROUTER_HOME, ROUTER_LOGIN, ROUTER_MODIFY_PASSWORD} from "../react/constants/RouterConstant";

/**
 * 跳转到登录页
 * @param history
 */
export function goToLoginPage(history) {
    history.push(ROUTER_LOGIN);
}

/**
 * 跳转到修改密码页面
 * @param history
 */
export function goToModifyPasswordPage(history) {
    history.push(ROUTER_MODIFY_PASSWORD);
}

/**
 * 跳转到主页
 * @param history
 */
export function goToHomePage(history) {
    history.push(ROUTER_HOME);
}