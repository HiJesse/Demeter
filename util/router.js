// go to util
import {ROUTER_LOGIN} from "../react/constants/routerConstant";

/**
 * 跳转到登录页
 * @param history
 */
export function goToLogin(history) {
    history.push(ROUTER_LOGIN)
}