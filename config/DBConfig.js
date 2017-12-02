// db config
import orm from "orm";
import * as Config from "./Config";
import * as LogUtil from "../util/LogUtil";
import {createUser, findUser, USER_ADMIN, userModel} from "../models/UserModel";
import {isArrayEmpty} from "../util/CheckerUtil";
import {ormPaging} from "../models/plugins/ORMPaging";

/**
 * 数据库连接
 * @type {null}
 */
let connection = null;

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

    userModel(orm, db);

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
    }).catch(() => {
        LogUtil.e('create default admin account failed!');
    });
};