// project models
import Mongoose from "mongoose";
import {getDate} from "../util/TimeUtil";
import {isArrayEmpty, isObjectEmpty} from "../util/CheckerUtil";
import * as LogUtil from "../util/LogUtil";
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
        createdAt: {type: 'date', time: true, defaultValue: getDate()}
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
 * @param params
 */
export const createProject = params => new Promise((resolve, reject) => {
    getProjectModel().create(params, (err, results) => {
        if (err) {
            LogUtil.e(`${TAG} createProject ${err}`);
            reject({createProjectError: false});
        } else {
            resolve(results);
        }
    });
});

/**
 * 添加项目平台信息
 * @param project 项目实例
 * @param resolve promise
 * @param reject promise
 */
const addPlatform = (project, resolve, reject) => {

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