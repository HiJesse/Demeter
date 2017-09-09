// user api
import ProjectModel from "../../../models/project";
import PlatformModel from "../../../models/platform";
import ProjectPlatformModel from "../../../models/projectPlatform";
import ProjectMemberModel from "../../../models/projectMember";
import {md5} from "../../../util/encrypt";
import {isStringEmpty} from "../../../util/checker";
import {URL_PROJECT_LOGO, URL_PROJECT_LOGO_DEFAULT} from "../../../util/pathUtil";
import {getTimeStamp} from "../../../util/timeUtil";

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
            } else if (count === 0) {
                reject({projectCount: count});
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
 * 根据参数判断用户是否已经加入项目
 * @param params
 * @returns {Promise}
 */
export const isUserJoinedProject = params =>
    new Promise((resolve, reject) => {
        ProjectMemberModel.find(params, (err, data) => {
            if (data.length === 1) {
                reject({isUserJoined: true});
            } else {
                resolve({isUserJoined: false});
            }
        });
    });

/**
 * 根据参数判断用户是否还没有加入项目
 * @param params
 * @returns {Promise}
 */
export const isUserNotJoinedProject = params =>
    new Promise((resolve, reject) => {
        ProjectMemberModel.find(params, (err, data) => {
            if (data.length === 1) {
                resolve({isUserNotJoined: false});
            } else {
                reject({isUserNotJoined: true});
            }
        });
    });

/**
 * 根据参数创建项目成员信息
 * @param params
 */
export const createProjectMemberInfo = params =>
    new Promise((resolve, reject) => {
        ProjectMemberModel.create(params, (error) => {
            if (!error) {
                resolve({memberJoined: true});
            } else {
                reject({memberJoined: false});
            }
        });
    });

/**
 * 根据参数获取项目成员数量, 失败的话返回-1
 * @param params
 * @returns {Promise}
 */
export const countProjectMembers = params =>
    new Promise((resolve, reject) => {
        ProjectMemberModel.count(params, (err, count) => {
            if (err) {
                reject({projectMemberCount: -1});
            } else if (count === 0) {
                reject({projectMemberCount: count});
            } else {
                resolve({projectMemberCount: count});
            }
        });
    });


/**
 * 根据参数和页码获取项目列表
 * @param pageSize 第几页
 * @param pageNum 一页的项目数量
 * @param params 查询参数
 */
export const findProjectMembersByPage = (pageSize, pageNum, params) => new Promise((resolve, reject) => {
    const query = ProjectMemberModel.find(params);
    query.skip((pageNum - 1) * pageSize);
    query.limit(pageSize);
    query.exec((err, data) => {
        if (err) {
            reject({findProjectMembers: false});
        }

        const projectMembers = data.map(item => ({account: item.userAccount}));
        resolve(projectMembers);
    });
});

/**
 * 删除项目成员
 * @param projectId
 * @param account
 */
export const deleteMember = (projectId, account) => new Promise((resolve, reject) => {
    ProjectMemberModel.remove({
        projectId: projectId,
        userAccount: account
    }, (err) => {
        if (err) {
            reject({projectMemberDeleted: false});
        } else {
            resolve({projectMemberDeleted: true});
        }
    });
});