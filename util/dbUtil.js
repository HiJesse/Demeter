// db util
import Mongoose from "mongoose";
import UserModel from "../models/user";
import PlatformModel from "../models/platform";
import * as Config from "../config";
import {md5} from "./encrypt";

/**
 * 判断默认的管理员账号是否存在
 * @returns {Promise}
 */
const isDefaultAdminExist = () =>
    new Promise((resolve, reject) => {
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

/**
 * 初始化默认管理员账号
 */
const initAdminAccount = () => {
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
};

/**
 * 是否已经存在初始化平台相关信息
 */
const isDefaultPlatformExist = () =>
    new Promise((resolve, reject) => {
        PlatformModel.find({}, (err, data) => {
            if (data.length === 2) {
                resolve({isDefaultPlatformExit: true});
            } else {
                reject({isDefaultPlatformExit: false})
            }
        });
    });

const createPlatform = (id, des) => {
    PlatformModel.create({
        platformId: id,
        des: des
    }, (error) => {
        console.log(`create default platform ${des} ${error ? 'failed' : 'succeed'}!`);
    });
};

/**
 * 初始化平台相关信息
 */
const initDefaultPlatform = () => {
    isDefaultPlatformExist().then(() => {
        console.log('default platform info is exit!');
    }).catch(() => {
        createPlatform(0, 'Android');
        createPlatform(1, 'IOS');
    })
};

/**
 * 连接DB, 并监听成功和失败
 */
export function connectDB() {
    Mongoose.connect(Config.env.DATABASE, {useMongoClient: true});

    Mongoose.connection.on("open", function () {
        console.info('Open MongoDB ' + Config.env.DATABASE + ' Succeed!');
        initAdminAccount();
        initDefaultPlatform();
    });

    Mongoose.connection.on('error', function () {
        console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
    });
}