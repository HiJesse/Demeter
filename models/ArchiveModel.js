// archive model
import {getFullDate} from "../util/TimeUtil";
import {isArrayEmpty, isObjectEmpty} from "../util/CheckerUtil";
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
        projectId: {type: 'number', require: true}, // 项目ID
        platformId: {type: 'number', require: true}, // 平台ID
        des: {type: 'text', default: '什么都没写'}, // 文档描述
        archiveName: {type: 'text', required: true}, // 文档名称
        archivePath: {type: 'text', required: true}, // 文档路径
        extraData: {type: 'text'}, // 扩展信息 例如IOS OTA plist下载路径等
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

/**
 * 按页查找文档列表
 * @param findParams 查找参数
 * @param pageSize 一页容量
 * @param pageNum 页码
 */
export const findArchiveByPage = (findParams, pageSize, pageNum) => new Promise((resolve, reject) => {
    const archive = getArchiveModel();

    archive.settings.set("pagination.perpage", pageSize);

    archive.pages(findParams, (err, pages) => {
        if (err) {
            LogUtil.e(`${TAG} findArchiveByPage pages ${err}`);
            reject({findArchivePage: true})
        }

        archive.page(findParams, pageNum).run(function (err, project) {
            if (err) {
                LogUtil.e(`${TAG} findArchiveByPage page ${err}`);
                reject({findArchivePage: true})
            }
            resolve(project);
        });
    });
});

/**
 * 根据参数查找文档
 * @param params
 */
export const findArchive = params => new Promise((resolve, reject) => {
    getArchiveModel().find(params, (err, results) => {
        if (err) {
            LogUtil.e(`${TAG} findArchive ${err}`);
            reject({findArchiveError: true});
        } else {
            resolve(results);
        }
    });
});

/**
 * 计算符合参数的文档总数
 * @param params
 */
export const countArchive = params => new Promise((resolve, reject) => {
    getArchiveModel().count(params, (err, count) => {
        if (err) {
            LogUtil.e(`${TAG} countArchive ${err}`);
            reject({countArchiveError: true});
        } else {
            resolve(count);
        }
    });
});

/**
 * 判断文档是否存在
 *
 * 异常返回 isArchiveExist
 * 用户不存在返回 isArchiveExistNotExist
 *
 * @param params
 */
export const isArchiveExist = params => new Promise((resolve, reject) => {
    getArchiveModel().find(params, (err, results) => {
        if (err) {
            LogUtil.e(`${TAG} isArchiveExist ${err}`);
            reject({isArchiveExistError: true});
        } else if (isArrayEmpty(results)) {
            reject({isArchiveExistNotExist: true});
        } else {
            resolve(results[0]);
        }
    });
});

/**
 * 根据参数删除文档信息
 * @param archive 文档实例
 */
export const deleteArchiveInfo = archive => new Promise((resolve, reject) => {
    archive.remove((err) => {
        if (err) {
            LogUtil.e(`${TAG} deleteArchiveInfo ${err}`);
            reject({deleteArchiveInfoError: true});
        } else {
            resolve();
        }
    });
});