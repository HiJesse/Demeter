// project models
import Mongoose from "mongoose";
import {getDate, getFullDate, getTimeStamp} from "../util/TimeUtil";
import {isArrayEmpty, isObjectEmpty} from "../util/CheckerUtil";
import * as LogUtil from "../util/LogUtil";
import {findPlatform} from "./PlatformModel";
import {md5} from "../util/EncryptUtil";
const Schema = Mongoose.Schema;

/**
 * 项目schema 包含项目基本信息
 */
const ProjectSchema = new Schema({
    projectName: {type: String, unique: true},
    avatar: {type: String},
    des: {type: String, default: '什么都没写'},
    createdDate: {type: String, default: getDate()},
});

export default Mongoose.model('Project', ProjectSchema);


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

    // 联表
    ProjectModel.hasMany('platform', {appId: String});
    ProjectModel.hasMany('user');
};

const TAG = 'ProjectModel';

/**
 * 获取项目model实例
 * @returns {*}
 */
export const getProjectModel = () => {
    if (isObjectEmpty(ProjectModel)) {
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
    getProjectModel().create(params, (err, project) => {
        if (err) {
            LogUtil.e(`${TAG} createProject ${err}`);
            reject({createProjectError: true});
        }

        // 获取平台
        findPlatform({}).then(platforms => {

            for (let i = 0; i < platforms.length; i++) {
                const platform = platforms[i];
                // 遍历平台信息 新增appId 与项目关联起来
                project.addPlatform(platform, {
                    appId: md5(project.id + platform.id + getTimeStamp() + '')
                }, err => {
                    if (err) {
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
    });
});

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