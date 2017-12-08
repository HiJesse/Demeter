// project api
import ProjectModel from "../../../models/ProjectModel";
import ProjectPlatformModel from "../../../models/ProjectPlatformModel";

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