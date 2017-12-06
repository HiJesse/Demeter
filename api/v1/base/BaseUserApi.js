// base user api
import UserModel from "../../../models/UserModel";
import {isArrayEmpty} from "../../../util/CheckerUtil";

/**
 * 根据params参数判读该用户是否存在
 * @param params
 * @returns {Promise}
 */
export const isUserExist = params => {
    return new Promise((resolve, reject) => {
        UserModel.find(params, (err, data) => {
            if (data.length === 1) {
                resolve({
                    isUserExist: true,
                    uId: data[0]._id,
                    nickname: data[0].nickName,
                    account: data[0].account,
                    isAdmin: data[0].isAdmin
                });
            } else {
                reject({isUserExist: false});
            }
        });
    });
};

/**
 * 根据params参数判断该用户是否为管理员
 * @param params
 * @returns {Promise}
 */
export const isAdmin = params => {
    return new Promise((resolve, reject) => {
        UserModel.find(params, (err, data) => {
            if (!isArrayEmpty(data) && data.length === 1 && data[0].isAdmin) {
                resolve({isAdmin: true});
            } else {
                reject({isAdmin: false});
            }
        });
    });
};

/**
 * 根据参数获取用户列表
 * @param params
 */
export const findUsers = params =>
    new Promise((resolve, reject) => {
        UserModel.find(params, (err, data) => {
            if (err) {
                reject({findUsers: false})
            }
            resolve(data);
        });
    });