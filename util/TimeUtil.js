// date util
import moment from "moment";

/**
 * 获取当前毫秒数
 */
export const getTimeStamp = () => new Date().getTime();

/**
 * 获取当前日期 格式为 1900-01-12
 * @returns {string}
 */
export const getDate = () => {
    const date = new Date();
    const separator = "-";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    return date.getFullYear() + separator + month + separator + strDate;
};

/**
 * 获取当前时间 格式为 12:12:12
 * @returns {string}
 */
export const getTime = () => {
    const date = new Date();
    const separator = ":";
    return date.getHours() + separator + date.getMinutes() + separator + date.getSeconds();
};

/**
 * 获取完整日期 格式为 1900-01-12 12:12:12
 */
export const getFullDate = () => getDate() + ' ' + getTime();

/**
 * 按照 1900-01-12 12:12:12 的格式 格式化日期
 * @param date
 */
export const formatDate = date => moment(date).format('YYYY-MM-DD HH:mm:ss');