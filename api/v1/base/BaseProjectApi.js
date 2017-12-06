// project api
import ProjectModel from "../../../models/ProjectModel";
import ProjectPlatformModel from "../../../models/ProjectPlatformModel";
import {isStringEmpty} from "../../../util/CheckerUtil";
import {URL_PROJECT_LOGO, URL_PROJECT_LOGO_DEFAULT} from "../../../util/PathUtil";

/**
 * 根据ProjectId删除对应的项目信息
 * @param projectId
 */
export const deleteProjectInfo = (projectId) => new Promise((resolve, reject) => {
    ProjectModel.remove({
        _id: projectId
    }, (err) => {
        if (err) {
            reject({projectDeleted: false});
        } else {
            resolve({projectDeleted: true});
        }
    });
});

/**
 * 根据参数查找项目信息
 * @param params
 */
export const getProjectInfo = params => new Promise((resolve, reject) => {
    ProjectModel.find(params, (err, data) => {
        if (err) {
            reject({isProjectExist: false});
        } else {
            resolve({
                projects: data
            });
        }
    });
});

/**
 * 根据ProjectId删除对应的所有平台数据
 * @param projectId
 */
export const deleteProjectPlatforms = (projectId) => new Promise((resolve, reject) => {
    ProjectPlatformModel.remove({
        projectId: projectId
    }, (err) => {
        if (err) {
            reject({projectPlatformsDeleted: false});
        } else {
            resolve({projectPlatformsDeleted: true});
        }
    });
});

/**
 * 获取项目平台信息
 * @param params
 */
export const findProjectPlatforms = params => new Promise((resolve, reject) => {
    ProjectPlatformModel.find(params, (err, data) => {
        if (err || data.length < 1) {
            reject({projectPlatformSize: -1});
            return;
        }
        resolve(data);
    });
});

/**
 * 根据项目ID数组获取项目信息
 * @param params
 */
export const findProjectsByIDs = params =>
    new Promise((resolve, reject) => {
        ProjectModel.find({
            _id: params
        }, (err, data) => {
            if (err) {
                reject({findProjects: false})
            }
            const allProjectInfo = data.map(function (item) {
                return {
                    projectId: item._id.toString(),
                    projectName: item.projectName,
                    avatar: isStringEmpty(item.avatar) ?
                        URL_PROJECT_LOGO_DEFAULT :
                        URL_PROJECT_LOGO + item.avatar,
                    des: item.des,
                    createdDate: item.createdDate
                };
            });
            resolve(allProjectInfo);
        });
    });