// project platform model
import {isArrayEmpty, isObjectEmpty} from "../util/CheckerUtil";
import * as LogUtil from "../util/LogUtil";


const TAG = 'ProjectPlatformModel';
let ProjectPlatformModel;

/**
 * 定义 项目平台 model
 * @param orm
 * @param db
 */
export const projectPlatformModel = (orm, db) => {
    ProjectPlatformModel = db.define('project_platforms', {
        project_id: {type: 'number', key: true},
        platforms_id: {type: "number", key: true},
        appId: {type: 'text'},
    }, {
        tableName: 'project_platforms'
    });
};


/**
 * 获取项目平台model实例
 * @returns {*}
 */
export const getProjectPlatformModel = () => {
    if (isObjectEmpty(ProjectPlatformModel)) {
        LogUtil.e(`${TAG} getProjectPlatformModel empty`);
        throw {projectPlatformModelError: true};
    }
    return ProjectPlatformModel;
};

/**
 * 根据参数查找项目平台信息
 * @param params
 */
export const isProjectPlatformExist = params => new Promise((resolve, reject) => {
    getProjectPlatformModel().find(params, (err, results) => {
        if (err) {
            LogUtil.e(`${TAG} isProjectPlatformExist ${err}`);
            reject({isProjectPlatformExistError: true});
        } else if (isArrayEmpty(results)){
            reject({isProjectPlatformNotExist: true});
        } else {
            resolve(results[0]);
        }
    });
});