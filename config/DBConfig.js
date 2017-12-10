// db config
import orm from "orm";
import * as Config from "./Config";
import * as LogUtil from "../util/LogUtil";
import {createUser, findUser, USER_ADMIN, userModel} from "../models/UserModel";
import {isArrayEmpty} from "../util/CheckerUtil";
import {ormPaging} from "../models/plugins/ORMPaging";
import {createPlatform, findPlatform, PLATFORM_ANDROID, PLATFORM_IOS, platformModel} from "../models/PlatformModel";
import {projectModel} from "../models/ProjectModel";
import {ormTransaction} from "../models/plugins/ORMTransaction";
import {archiveModel} from "../models/ArchiveModel";
import {projectPlatformModel} from "../models/ProjectPlatformModel";

/**
 * 数据库连接
 * @type {null}
 */
let connection = null;

/**
 * 获取数据库连接
 */
export const getConnection = () => connection;

/**
 * 构建express用orm
 */
export const ormExpress = (req, res, next) => initORM((error, db) => {
    if (error) {
        return next(error);
    }

    req.models = db.models;
    req.db = db;
    return next();
});

/**
 * 连接数据库, 保存连接并初始化model
 * @param callback
 * @returns {*}
 */
export const initORM = callback => {
    if (connection) { // 如果已经有数据库连接了, 就直接回调出去
        return callback(null, connection);
    }

    // 创建数据库连接
    orm.connect(Config.env.DB, (err, db) => {
        if (err) {
            LogUtil.e('ORM ' + err);
            return callback(err);
        }

        LogUtil.i('ORM connected');

        // 保存连接
        connection = db;
        db.settings.set('instance.returnAllErrors', true);

        // 安装models
        setup(db, callback);
    });
};

/**
 * 安装 models
 * @param db 数据库实例
 * @param callback 回调
 * @returns {*}
 */
const setup = (db, callback) => {
    // 加载分页插件
    db.use(ormPaging);
    // 加载事务插件
    db.use(ormTransaction);

    userModel(orm, db);
    platformModel(orm, db);
    archiveModel(orm, db);
    projectModel(orm, db);
    projectPlatformModel(orm, db);

    db.sync((error) => {
        if (error) {
            LogUtil.e('ORM ' + error);
            return;
        }
        initDBData();
    });


    return callback(null, db);
};

/**
 * 初始化 数据库数据
 *
 * 1. 创建admin账号
 * 2. 创建默认平台信息 android & ios
 */
const initDBData = () => {

    /**
     * 1. 判断是否存在admin用户
     * 2. 不存在的话创建admin
     */
    findUser({
        account: 'admin'
    }).then((user) => {
        if (!isArrayEmpty(user)) {
            LogUtil.i('default admin account is exit!');
            return;
        }
        return createUser(USER_ADMIN);
    }).catch(err => {
        LogUtil.e(`create default admin account failed! ${JSON.stringify(err)}`);
    });

    /**
     * 1. 查找所有平台信息
     * 2. 平台数量是否匹配
     * 3. 创建android 和ios平台
     */
    findPlatform({}).then(platforms => {
        if (!isArrayEmpty(platforms) && platforms.length === 2) {
            throw {isPlatformExist: true};
        }
        return createPlatform(PLATFORM_ANDROID);
    }).then(() => {
        return createPlatform(PLATFORM_IOS);
    }).catch(err => {
        if (err.isPlatformExist) {
            LogUtil.i('default platform is exit!');
        } else {
            LogUtil.e(`create default admin platform failed! ${JSON.stringify(err)}`);
        }
    })


};