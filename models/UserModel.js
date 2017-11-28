// user model
import Mongoose from "mongoose";
import * as LogUtil from "../util/LogUtil";
import {isObjectEmpty} from "../util/CheckerUtil";
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