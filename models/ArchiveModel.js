// archive model
import {getFullDate} from "../util/TimeUtil";
import {isObjectEmpty} from "../util/CheckerUtil";
import * as LogUtil from "../util/LogUtil";

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