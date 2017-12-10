// project models
import {getFullDate, getTimeStamp} from "../util/TimeUtil";
import {isArrayEmpty, isObjectEmpty} from "../util/CheckerUtil";
import * as LogUtil from "../util/LogUtil";
import {findPlatform, getPlatformModel} from "./PlatformModel";
import {md5} from "../util/EncryptUtil";
import {getConnection} from "../config/DBConfig";
import {getUserModel} from "./UserModel";
import {getArchiveModel} from "./ArchiveModel";


let ProjectModel;

/**
 * 定义 项目 model
 * @param orm
 * @param db
 */
export const projectModel = (orm, db) => {
    ProjectModel = db.define('project', {
        id: {type: 'serial', key: true},
        projectName: {type: "text", size: 10, unique: true},
        avatar: {type: 'text'},
        des: {type: 'text', size: 20, defaultValue: '什么都没写'},
        createdAt: {type: 'date', time: true, defaultValue: getFullDate()}
    }, {
        tableName: 'project'
    });

    // 联表 一对多 平台
    ProjectModel.hasMany('platforms', getPlatformModel(), {
        appId: {type: 'text', require: true},
    }, {
        autoFetch: true,
        key: true,
        reverse: 'projects'
    });

    // 联表 多对多 项目成员
    ProjectModel.hasMany('users', getUserModel(), {}, {
        key: true,
        reverse: 'projects',
    });

    // 联表 一对多 文档
    ProjectModel.hasMany('archives', getArchiveModel(), {}, {reverse: 'project'});
};

const TAG = 'ProjectModel';

/**
 * 获取项目model实例
 * @returns {*}
 */
export const getProjectModel = () => {
    if (isObjectEmpty(ProjectModel)) {
        LogUtil.e(`${TAG} getProjectModel empty`);
        throw {projectModelError: true};
    }
    return ProjectModel;
};

/**
 * 根据参数创建项目
 *
 * 1. 创建项目
 * 2. 获取平台信息
 * 3. 遍历平台信息 添加appId 保存到项目信息中
 *
 * @param params
 */
export const createProject = params => new Promise((resolve, reject) => {
    getConnection().transaction((err, transaction) => {
        if (err) {
            LogUtil.e(`${TAG} createProject transaction ${err}`);
            reject({createProjectError: true});
        }

        getProjectModel().create(params, (err, project) => {
            if (err) {
                LogUtil.e(`${TAG} createProject ${err}`);
                reject({createProjectError: true});
            }

            createProjectPlatform(project, resolve, reject);
        });

        transaction.commit(err => {
            if (err) {
                LogUtil.e(`${TAG} createProject transaction commit ${err}`);
                reject({createProjectError: true});
            }
        });
    });
});

/**
 * 创建项目平台信息
 *
 * 1. 查找已有平台信息
 * 2. 遍历 新增appId字段
 * 3. 添加到项目中
 *
 * @param project 项目实例
 * @param resolve promise
 * @param reject promise
 */
const createProjectPlatform = (project, resolve, reject) => {
    findPlatform({}).then(platforms => {

        for (let i = 0; i < platforms.length; i++) {
            const platform = platforms[i];
            // 遍历平台信息 新增appId 与项目关联起来
            project.addPlatforms(platform, {
                appId: md5(project.id + platform.id + getTimeStamp() + '')
            }, err => {
                if (err) {
                    LogUtil.e(`${TAG} addPlatformToProject ${err}`);
                    reject({addPlatformToProjectError: true});
                    throw err;
                } else if (i === platforms.length - 1) {
                    resolve(project);
                }

            });
        }
    }).catch(err => {
        LogUtil.e(`${TAG} findPlatform ${err}`);
        reject(err);
    })
};

/**
 * 根据参数查找项目
 * @param params
 */
export const findProject = params => new Promise((resolve, reject) => {
    getProjectModel().find(params, (err, results) => {
        if (err) {
            LogUtil.e(`${TAG} findProject ${err}`);
            reject({findProjectError: true});
        } else {
            resolve(results);
        }
    });
});

/**
 * 计算总项目数
 * @param params
 */
export const countProject = params => new Promise((resolve, reject) => {
    getProjectModel().count(params, (err, count) => {
        if (err) {
            LogUtil.e(`${TAG} countProject ${err}`);
            reject({countProjectError: true});
        } else {
            resolve(count);
        }
    });
});

/**
 * 判断项目是否存在
 *
 * 异常返回 isProjectExistError
 * 用户不存在返回 isProjectNotExist
 *
 * @param params
 */
export const isProjectExist = params => new Promise((resolve, reject) => {
    getProjectModel().find(params, (err, results) => {
        if (err) {
            LogUtil.e(`${TAG} isProjectExist ${err}`);
            reject({isProjectExistError: true});
        } else if (isArrayEmpty(results)) {
            reject({isProjectNotExist: true});
        } else {
            resolve(results[0]);
        }
    });
});

/**
 * 保存项目信息 将callback转为 promise
 * @param project
 */
export const saveProjectInfo = project => new Promise((resolve, reject) => {
    project.save(err => {
        if (err) {
            LogUtil.e(`${TAG} saveProjectInfo ${err}`);
            reject({saveUserInfoError: true});
        }
        resolve();
    });
});

/**
 * 按页查找项目列表
 * @param findParams 查找参数
 * @param pageSize 一页容量
 * @param pageNum 页码
 */
export const findProjectByPage = (findParams, pageSize, pageNum) => new Promise((resolve, reject) => {
    const project = getProjectModel();

    project.settings.set("pagination.perpage", pageSize);

    project.pages(findParams, (err, pages) => {
        if (err) {
            LogUtil.e(`${TAG} findProjectByPage pages ${err}`);
            reject({findProjectPage: true})
        }

        project.page(findParams, pageNum).run(function (err, project) {
            if (err) {
                LogUtil.e(`${TAG} findProjectByPage page ${err}`);
                reject({findProjectPage: true})
            }
            resolve(project);
        });
    });
});

/**
 * 根据参数项目信息
 * @param project 项目实例
 */
export const deleteProjectInfo = project => new Promise((resolve, reject) => {
    project.remove((err) => {
        if (err) {
            LogUtil.e(`${TAG} deleteProjectInfo ${err}`);
            reject({deleteProjectInfoError: true});
        } else {
            resolve();
        }
    });
});