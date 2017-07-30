// db util
import Mongoose from "mongoose";
import UserModel from "../models/user";
import * as Config from "../config";
import {md5} from "./encrypt";

/**
 * 判断默认的管理员账号是否存在
 * @returns {Promise}
 */
function isDefaultAdminExist() {
    return new Promise((resolve, reject) => {
        UserModel.find({
            account: 'admin'
        }, (err, data) => {
            if (data.length === 1) {
                resolve({isDefaultAdminExit: true});
            } else {
                reject({isDefaultAdminExit: false});
            }
        });
    });
}

/**
 * 初始化默认管理员账号
 */
function initAdminAccount() {
    isDefaultAdminExist().then(() => {
        console.log('default admin account is exit!');
    }).catch((error) => {
        if (error.isDefaultAdminExit !== false) {
            return;
        }
        UserModel.create({
            account: 'admin',
            pwd: md5('a123456'),
            isAdmin: true
        }, (error) => {
            console.log(`create default admin account ${error ? 'failed' : 'succeed'}!`);
        });
    })
}

/**
 * 连接DB, 并监听成功和失败
 */
export function connectDB() {
    Mongoose.connect(Config.env.DATABASE, {useMongoClient:true});

    Mongoose.connection.on("open", function () {
        console.info('Open MongoDB ' + Config.env.DATABASE + ' Succeed!');
        initAdminAccount();
    });

    Mongoose.connection.on('error', function () {
        console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
    });
}