// user model
import Mongoose from "mongoose";
import * as LogUtil from "../util/LogUtil";
import {isArrayEmpty, isObjectEmpty} from "../util/CheckerUtil";
import {md5} from "../util/EncryptUtil";
const Schema = Mongoose.Schema;

const UserSchema = new Schema({
    nickName: {type: String, default: '匿名'},
    account: {type: String, unique: true},
    pwd: {type: String},
    isAdmin: {type: Boolean, default: false},
    accessToken: {type: String},
});


export default Mongoose.model('User', UserSchema);

let UserModel;

/**
 * 定义 用户 model
 * @param orm
 * @param db
 */
export const userModel = (orm, db) => {
    LogUtil.i('DB created');
    UserModel = db.define('user', {
        id: {type: 'serial', key: true},
        nickName: {type: "text", size: 10, defaultValue: "匿名"},
        account: {type: 'text', size: 10, required: true, unique: true},
        pwd: {type: 'text', required: true},
        admin: {type: 'boolean', required: true},
        accessToken: {type: 'text', required: true},
        createdAt: {type: 'date', time: true, required: true}
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
    accessToken: 'tmp',
    createdAt: '2017-11-11'
};

/**
 * 获取用户model实例
 * @returns {*}
 */
export const getUserModel = () => {
    if (isObjectEmpty(UserModel)) {
        throw {};
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