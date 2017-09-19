// project api
import ProjectModel from "../../../models/project";
import PlatformModel from "../../../models/platform";
import ProjectPlatformModel from "../../../models/projectPlatform";
import {md5} from "../../../util/encrypt";
import {isStringEmpty} from "../../../util/checker";
import {URL_PROJECT_LOGO, URL_PROJECT_LOGO_DEFAULT} from "../../../util/pathUtil";
import {getTimeStamp} from "../../../util/timeUtil";

/**
 * 根据params参数判读该项目是否不存在
 * @param params
 * @returns {Promise}
 */
export const isProjectNotExist = params => {
    return new Promise((resolve, reject) => {
        ProjectModel.find(params, (err, data) => {
            if (data.length === 1) {
                reject({isProjectNotExist: false});
            } else {
                resolve({isProjectNotExist: true});
            }
        });
    });
};

/**
 * 根据项目名称说明和logo建立项目信息
 * @param name
 * @param des
 * @param logo
 */
export const createProjectInfo = (name, des, logo) => {
    const params = {
        projectName: name,
        des: des,
        avatar: logo === undefined ? '' : logo.filename
    };
    return new Promise((resolve, reject) => {
        ProjectModel.create(params, (error) => {
            if (!error) {
                resolve({projectCreated: true});
            } else {
                reject({projectCreated: false});
            }
        });
    });
};

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
 * 获取项目所属平台信息
 */
export const getPlatforms = () => new Promise((resolve, reject) => {
    PlatformModel.find({}, (err, data) => {
        if (err) {
            reject({isPlatformExist: false});
        } else {
            resolve({
                platforms: data
            });
        }
    });
});

/**
 * 根据项目id和平台id, 创建项目的下属各个平台数据
 * @param projectId
 * @param platforms
 */
export const createProjectPlatforms = (projectId, platforms) => new Promise((resolve, reject) => {
    const params = platforms.map((item) => ({
        projectId: projectId,
        platformId: item.platformId,
        appId: md5(projectId + item.platformId + getTimeStamp())
    }));

    ProjectPlatformModel.create(params, (error) => {
        if (!error) {
            resolve({projectPlatformsCreated: true});
        } else {
            reject({projectPlatformsCreated: false});
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
        if (data.length < 1) {
            reject({projectPlatformSize: -1});
            return;
        }
        resolve(data);
    });
});

/**
 * 根据参数获取项目总数, 失败的话返回-1
 * @param params
 * @returns {Promise}
 */
export const countProjects = params => {
    return new Promise((resolve, reject) => {
        ProjectModel.count(params, (err, count) => {
            if (err) {
                reject({projectCount: -1});
            } else {
                resolve({projectCount: count});
            }
        });
    });
};

/**
 * 根据项目名称模糊匹配项目数量
 * @param projectName
 * @returns {Promise}
 */
export const countProjectsByName = projectName => {
    const findParams = {};
    if (!isStringEmpty(projectName) && projectName !== 'null') {
        findParams.projectName = new RegExp(projectName, 'i');
    }
    return countProjects(findParams);
};

/**
 * 根据参数和页码获取项目列表
 * @param pageSize 第几页
 * @param pageNum 一页的项目数量
 * @param params 查询参数
 */
export const findProjectsByPage = (pageSize, pageNum, params) => new Promise((resolve, reject) => {
    const query = ProjectModel.find(params);
    query.skip((pageNum - 1) * pageSize);
    query.limit(pageSize);
    query.exec((err, data) => {
        if (data.length < 1) {
            reject();
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

/**
 * 根据项目名称模糊匹配出项目列表
 * @param pageSize
 * @param pageNum
 * @param projectName
 */
export const findProjectsByName = (pageSize, pageNum, projectName) => {
    const findParams = {};
    if (!isStringEmpty(projectName) && projectName !== 'null') {
        findParams.projectName = new RegExp(projectName, 'i');
    }

    return findProjectsByPage(pageSize, pageNum, findParams);
};

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