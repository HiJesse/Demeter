// user api
import ProjectModel from "../../models/project";
import PlatformModel from "../../models/platform";
import ProjectPlatformModel from "../../models/projectPlatform";
import {
    RES_FAILED_COUNT_PROJECT,
    RES_FAILED_COUNT_PROJECT_EMPTY,
    RES_FAILED_CREATE_PROJECT,
    RES_FAILED_CREATE_PROJECT_PLATFORMS,
    RES_FAILED_DELETE_PROJECT,
    RES_FAILED_DELETE_PROJECT_PLATFORMS,
    RES_FAILED_FETCH_PROJECT_LIST,
    RES_FAILED_FETCH_PROJECT_PLATFORM,
    RES_FAILED_NOT_ADMIN,
    RES_FAILED_PLATFORM_NOT_EXIST,
    RES_FAILED_PROJECT_NOT_EXIST,
    RES_MSG_COUNT_PROJECT,
    RES_MSG_COUNT_PROJECT_EMPTY,
    RES_MSG_CREATE_PROJECT,
    RES_MSG_CREATE_PROJECT_PLATFORMS,
    RES_MSG_DELETE_PROJECT,
    RES_MSG_DELETE_PROJECT_PLATFORMS,
    RES_MSG_FETCH_PROJECT_LIST,
    RES_MSG_FETCH_PROJECT_PLATFORM,
    RES_MSG_NOT_ADMIN,
    RES_MSG_PLATFORM_NOT_EXIST,
    RES_MSG_PROJECT_NOT_EXIST,
    RES_SUCCEED
} from "../../util/status";
import {md5} from "../../util/encrypt";
import {buildResponse} from "../../util/ajax";
import {isAdmin} from "./user";
import {isObjectEmpty, isStringEmpty} from "../../util/checker";
import {concatProjectAndPlatformInfo} from "../../util/arrayUtil";

/**
 * 根据项目名称说明和logo建立项目信息
 * @param name
 * @param des
 * @param logo
 */
const createProjectInfo = (name, des, logo) => {
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
const deleteProjectInfo = (projectId) => new Promise((resolve, reject) => {
    ProjectModel.remove({
        projectId: projectId
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
const getProjectInfo = params => new Promise((resolve, reject) => {
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
const getPlatforms = () => new Promise((resolve, reject) => {
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
const createProjectPlatforms = (projectId, platforms) => new Promise((resolve, reject) => {
    const params = platforms.map((item) => ({
        projectId: projectId,
        platformId: item.platformId,
        appId: md5(projectId + item.platformId)
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
const deleteProjectPlatforms = (projectId) => new Promise((resolve, reject) => {
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
const findProjectPlatforms = params => new Promise((resolve, reject) => {
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
const countProjects = params => {
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
const countProjectsByName = projectName => {
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
const findProjectsByPage = (pageSize, pageNum, params) => new Promise((resolve, reject) => {
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
                avatar: item.avatar,
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
const findProjectsByName = (pageSize, pageNum, projectName) => {
    const findParams = {};
    if (!isStringEmpty(projectName) && projectName !== 'null') {
        findParams.projectName = new RegExp(projectName, 'i');
    }

    return findProjectsByPage(pageSize, pageNum, findParams);
};

/**
 * 创建新项目
 * 1. 获取平台信息
 * 2. 创建项目信息
 * 3. 根据平台信息和项目ID创建项目平台信息, 并生成对应的app id
 * @param req
 * @param res
 */
export const createProject = (req, res) => {
    let status = RES_FAILED_CREATE_PROJECT;
    let msg = RES_MSG_CREATE_PROJECT;

    const projectName = req.body.projectName;
    const projectDes = req.body.projectDes;
    const projectLogo = req.file;
    let platforms;

    getPlatforms().then((data) => {
        platforms = data.platforms;
        return createProjectInfo(projectName, projectDes, projectLogo);
    }).then(() => {
        return getProjectInfo({
            projectName: projectName
        })
    }).then(data => {
        return createProjectPlatforms(data.projects[0]._id, platforms);
    }).then(() => {
        status = RES_SUCCEED;
        msg = null;
        res.json(buildResponse(status, {}, msg));
    }).catch(error => {
        if (error.isProjectExist === false) {
            status = RES_FAILED_PROJECT_NOT_EXIST;
            msg = RES_MSG_PROJECT_NOT_EXIST;
        } else if (error.isPlatformExist === false) {
            status = RES_FAILED_PLATFORM_NOT_EXIST;
            msg = RES_MSG_PLATFORM_NOT_EXIST;
        } else if (error.projectPlatformsCreated === false) {
            status = RES_FAILED_CREATE_PROJECT_PLATFORMS;
            msg = RES_MSG_CREATE_PROJECT_PLATFORMS;
        }
        res.json(buildResponse(status, {}, msg));
    })
};

/**
 * 删除项目
 * 1. 校验请求者身份
 * 2. 删除项目相关平台信息
 * 3. 删除项目信息
 * @param req
 * @param res
 */
export const deleteProject = (req, res) => {
    let status = RES_FAILED_DELETE_PROJECT;
    let msg = RES_MSG_DELETE_PROJECT;

    const uId = req.body.uId;
    const projectId = req.body.projectId;

    isAdmin({_id: uId}).then(() => {
        return deleteProjectPlatforms(projectId);
    }).then(() => {
        return deleteProjectInfo(projectId);
    }).then(() => {
        status = RES_SUCCEED;
        msg = null;
        res.json(buildResponse(status, {}, msg));
    }).catch((error) => {
        if (error.isAdmin === false) {
            status = RES_FAILED_NOT_ADMIN;
            msg = RES_MSG_NOT_ADMIN;
        } else if (error.projectPlatformsDeleted === false) {
            status = RES_FAILED_DELETE_PROJECT_PLATFORMS;
            msg = RES_MSG_DELETE_PROJECT_PLATFORMS;
        }
        res.json(buildResponse(status, {}, msg));
    })

};

/**
 * 根据页码和项目名称模糊搜索项目列表, 其中包含平台信息
 * 1. 校验是否为管理员
 * 2. 获取项目总量
 * 3. 根据页码获取项目列表
 * 4. 根据项目列表获取平台列表
 * 5. 整合两个列表并回调
 * @param req
 * @param res
 */
export const fetchProjectList = (req, res) => {
    const uId = req.query.uId;
    const pageSize = Number(req.query.pageSize);
    const pageNum = Number(req.query.pageNum);
    const nameSearch = req.query.projectName;
    const adminParams = {
        _id: uId
    };

    let status = RES_FAILED_FETCH_PROJECT_LIST;
    let msg = RES_MSG_FETCH_PROJECT_LIST;
    let projectCount = -1;
    let projectList;

    isAdmin(adminParams).then(() => {
        return countProjectsByName(nameSearch);
    }).then((data) => {
        projectCount = data.projectCount;
        return findProjectsByName(pageSize, pageNum, nameSearch);
    }).then((allProjectInfo) => {
        projectList = allProjectInfo;
        return findProjectPlatforms(allProjectInfo);
    }).then((projectPlatformInfo) => {
        status = RES_SUCCEED;
        msg = null;
        res.json(buildResponse(status, {
            projectList: concatProjectAndPlatformInfo(projectList, projectPlatformInfo),
            projectCount: projectCount,
            pageNum: pageNum
        }, msg));
    }).catch((error) => {
        if (isObjectEmpty(error)) {
            status = RES_FAILED_FETCH_PROJECT_LIST;
            msg = RES_MSG_FETCH_PROJECT_LIST;
        } else if (error.isAdmin === false) {
            status = RES_FAILED_NOT_ADMIN;
            msg = RES_MSG_NOT_ADMIN;
        } else if (error.projectCount === -1) {
            status = RES_FAILED_COUNT_PROJECT;
            msg = RES_MSG_COUNT_PROJECT;
        } else if (error.projectCount === 0) {
            status = RES_FAILED_COUNT_PROJECT_EMPTY;
            msg = RES_MSG_COUNT_PROJECT_EMPTY;
        } else if (error.projectPlatformSize === -1) {
            status = RES_FAILED_FETCH_PROJECT_PLATFORM;
            msg = RES_MSG_FETCH_PROJECT_PLATFORM;
        }
        res.json(buildResponse(status, {}, msg));
    });
};
