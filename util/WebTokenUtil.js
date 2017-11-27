// web token
import JWT from "jsonwebtoken";
import * as Config from "../config/Config";

/**
 * 返回从当前时刻开始days天后的日期
 * @param days
 * @returns {Date}
 */
function daysFromNow(days) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + days);
    return exp;
}

/**
 * 生成web token
 * @returns {*}
 */
export function createJsonWebToken(uId) {
    const payload = {
        uId: uId,
        expiration: parseInt(daysFromNow(5).getTime() / 1000),
    };
    return JWT.sign(payload, Config.env.JWT.secret);
}