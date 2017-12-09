// platform model
import {isObjectEmpty} from "../util/CheckerUtil";
import * as LogUtil from "../util/LogUtil";

const TAG = 'PlatformModel';

let PlatformModel;

/**
 * 定义 平台 model
 * @param orm
 * @param db
 */
export const platformModel = (orm, db) => {
    PlatformModel = db.define('platform', {
        id: {type: 'serial', key: true},
        platformId: {type: "number", required: true},
        des: {type: 'text', size: 10, required: true, defaultValue: "Android"}
    }, {
        tableName: 'platform'
    });
};

/**
 * android 平台信息
 * @type {{platformId: number}}
 */
export const PLATFORM_ANDROID = {
    platformId: 0,
};

/**
 * ios 平台信息
 * @type {{platformId: number, des: string}}
 */
export const PLATFORM_IOS = {
    platformId: 1,
    des: 'IOS'
};

/**
 * 获取平台model实例
 * @returns {*}
 */
export const getPlatformModel = () => {
    if (isObjectEmpty(PlatformModel)) {
        LogUtil.e(`${TAG} getPlatformModel empty`);
        throw {platformModelError: true};
    }
    return PlatformModel;
};

/**
 * 根据参数查找平台
 * @param params
 */
export const findPlatform = (params) => new Promise((resolve, reject) => {
    getPlatformModel().find(params, (err, results) => {
        if (err) {
            LogUtil.e(`${TAG} findPlatform ${err}`);
            reject({findPlatformError: true});
        } else {
            resolve(results);
        }
    });
});


/**
 * 创建平台
 * @param params
 */
export const createPlatform = params => new Promise((resolve, reject) => {
    getPlatformModel().create(params, (err, results) => {
        if (err) {
            LogUtil.e(`${TAG} createPlatform ${err}`);
            reject({createPlatformError: false});
        } else {
            resolve(results);
        }
    });
});