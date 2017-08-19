// user api
import ProjectModel from "../../models/project";
import PlatformModel from "../../models/platform"
import ProjectPlatformModel from "../../models/projectPlatform";
import {
    RES_FAILED_CREATE_PROJECT,
    RES_FAILED_CREATE_PROJECT_PLATFORMS,
    RES_FAILED_PLATFORM_NOT_EXIST,
    RES_FAILED_PROJECT_NOT_EXIST,
    RES_MSG_CREATE_PROJECT,
    RES_MSG_CREATE_PROJECT_PLATFORMS,
    RES_MSG_PLATFORM_NOT_EXIST,
    RES_MSG_PROJECT_NOT_EXIST,
    RES_SUCCEED
} from "../../util/status";
import {md5} from "../../util/encrypt";
import {buildResponse} from "../../util/ajax";

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