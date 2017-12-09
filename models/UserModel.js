// user model
import * as LogUtil from "../util/LogUtil";
import {isArrayEmpty, isObjectEmpty} from "../util/CheckerUtil";
import {md5} from "../util/EncryptUtil";
import {getFullDate} from "../util/TimeUtil";

let UserModel;

/**
 * 定义 用户 model
 * @param orm
 * @param db
 */
export const userModel = (orm, db) => {
    UserModel = db.define('user', {
        id: {type: 'serial', key: true},
        nickName: {type: "text", size: 10, defaultValue: "匿名"},
        account: {type: 'text', size: 10, required: true, unique: true},
        pwd: {type: 'text', required: true},
        admin: {type: 'boolean', required: true},
        createdAt: {type: 'date', time: true, defaultValue: getFullDate()}
    }, {
        tableName: 'user'
    }, {
        hooks: {
            beforeValidation: () => {
                // this.createdAt = getData();
            }
        },
        methods: {
            // 是否为管理员
            isAdmin: () => this.admin,
        }
    });
};

const TAG = 'UserModel';

/**
 * 默认管理员用户信息
 */
export const USER_ADMIN = {
    nickName: 'admin',
    account: 'admin',
    pwd: md5('a123456'),
    admin: true,
    createAt: getFullDate(),
};

/**
 * 获取用户model实例
 * @returns {*}
 */
export const getUserModel = () => {
    if (isObjectEmpty(UserModel)) {
        LogUtil.e(`${TAG} getUserModel empty`);
        throw {userModelError: true};
    }
    return UserModel;
};

/**
 * 根据参数查找用户
 * @param params
 */
export const findUser = params => new Promise((resolve, reject) => {
    getUserModel().find(params, (err, results) => {
        if (err) {
            LogUtil.e(`${TAG} findUser ${err}`);
            reject({findUserError: true});
        } else {
            resolve(results);
        }
    });
});

/**
 * 计算总用户数
 * @param params
 */
export const countUser = params => new Promise((resolve, reject) => {
    getUserModel().count(params, (err, count) => {
        if (err) {
            LogUtil.e(`${TAG} countUser ${err}`);
            reject({countUserError: true});
        } else {
            resolve(count);
        }
    });
});

/**
 * 创建用户
 * @param params
 */
export const createUser = params => new Promise((resolve, reject) => {
    getUserModel().create(params, (err, results) => {
        if (err) {
            LogUtil.e(`${TAG} createUser ${err}`);
            reject({createUserError: false});
        } else {
            resolve(results);
        }
    });
});

/**
 * 判断用户是否存在
 *
 * 异常返回 isUserExistError
 * 用户不存在返回 userNotExist
 *
 * @param params
 */
export const isUserExist = params => new Promise((resolve, reject) => {
    getUserModel().find(params, (err, results) => {
        if (err) {
            LogUtil.e(`${TAG} isUserExist ${err}`);
            reject({isUserExistError: true});
        } else if (isArrayEmpty(results)) {
            reject({userNotExist: true});
        } else {
            resolve(results[0]);
        }
    });
});

/**
 * 保存用户信息 将callback转为 promise
 * @param user
 */
export const saveUserInfo = user => new Promise((resolve, reject) => {
    user.save(err => {
        if (err) {
            LogUtil.e(`${TAG} saveUserInfo ${err}`);
            reject({saveUserInfoError: true});
        }
        resolve();
    });
});

/**
 * 判断用户是否为管理员
 *
 * 异常返回 isAdminUserError
 * 用户不存在返回 userNotExist
 * 不是管理员返回 isNotAdmin
 *
 * @param params
 */
export const isAdminUser = params => new Promise((resolve, reject) => {
    getUserModel().find(params, (err, results) => {
        if (err) {
            LogUtil.e(`${TAG} isAdminUser ${err}`);
            reject({isAdminUserError: true});
        } else if (isArrayEmpty(results)) {
            reject({userNotExist: true});
        } else if (results[0].admin) {
            resolve(results[0]);
        } else {
            reject({isNotAdmin: true});
        }
    });
});

/**
 * 按页查找用户列表
 * @param findParams 查找参数
 * @param pageSize 一页容量
 * @param pageNum 页码
 */
export const findUserByPage = (findParams, pageSize, pageNum) => new Promise((resolve, reject) => {
    const user = getUserModel();

    user.settings.set("pagination.perpage", pageSize);

    user.pages(findParams, (err, pages) => {
        if (err) {
            LogUtil.e(`${TAG} findUserByPage pages ${err}`);
            reject({findUserByPage: true})
        }

        user.page(findParams, pageNum).order("account").run(function (err, people) {
            if (err) {
                LogUtil.e(`${TAG} findUserByPage page ${err}`);
                reject({findUserByPage: true})
            }
            resolve(people);
        });
    });
});

/**
 * 删除用户
 * @param params
 */
export const deleteUser = params => new Promise((resolve, reject) => {
    getUserModel().find(params).remove((err) => {
        if (err) {
            LogUtil.e(`${TAG} deleteUser ${err}`);
            reject({deleteUserError: true});
        } else {
            resolve();
        }
    });
});