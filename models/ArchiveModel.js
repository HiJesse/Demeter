// archive model
import {getFullDate} from "../util/TimeUtil";
import {isObjectEmpty} from "../util/CheckerUtil";
import * as LogUtil from "../util/LogUtil";
import {getConnection} from "../config/DBConfig";

const TAG = 'ArchiveModel';

let ArchiveModel;

/**
 * 定义 文档 model
 * @param orm
 * @param db
 */
export const archiveModel = (orm, db) => {
    ArchiveModel = db.define('archive', {
        platformId: {type: 'number', require: true}, // 平台ID
        des: {type: 'text', default: '什么都没写'}, // 文档描述
        archiveName: {type: 'text', required: true}, // 文档名称
        archivePath: {type: 'text', required: true}, // 文档路径
        archiveSize: {type: 'number'}, // 文档大小 KB
        createdAt: {type: 'date', time: true, defaultValue: getFullDate()}, // 文档创建时间
    }, {
        tableName: 'archive'
    });
};

/**
 * 获取文档model实例
 * @returns {*}
 */
export const getArchiveModel = () => {
    if (isObjectEmpty(ArchiveModel)) {
        LogUtil.e(`${TAG} getArchiveModel empty`);
        throw {archiveModelError: true};
    }
    return ArchiveModel;
};

/**
 * 创建文档记录 事务
 *
 * 1. 创建事务
 * 2. 创建文档
 * 3. 把文档记录加入对应的项目中
 *
 * @param params 创建文档的参数
 * @param project 文档对应的项目
 */
export const createArchive = (params, project) => new Promise((resolve, reject) => {
    getConnection().transaction((err, transaction) => {
        if (err) {
            LogUtil.e(`${TAG} createArchive transaction ${err}`);
            reject({createArchiveError: true});
        }

        getArchiveModel().create(params, (err, archive) => {
            if (err) {
                LogUtil.e(`${TAG} createArchive ${err}`);
                reject({createArchiveError: true});
            }

            project.addArchives(archive, err => {
                if (err) {
                    LogUtil.e(`${TAG} addArchiveToProject ${err}`);
                    reject({addArchiveToProjectError: true})
                } else {
                    resolve();
                }

            });

        });

        transaction.commit(err => {
            if (err) {
                LogUtil.e(`${TAG} createArchive transaction commit ${err}`);
                reject({createArchiveError: true});
            }
        });
    });
});