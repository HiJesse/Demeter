// base project member api
import ProjectMemberModel from "../../../models/projectMember";

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

/**
 * 获取有用户加入的项目列表, 失败的话返回-1
 * @param params
 * @returns {Promise}
 */
export const countUserJoinedProjects = params =>
    new Promise((resolve, reject) => {
        ProjectMemberModel.count(params, (err, count) => {
            if (err) {
                reject({userJoinedProjectCount: -1});
            } else if (count === 0) {
                reject({userJoinedProjectCount: count});
            } else {
                resolve({userJoinedProjectCount: count});
            }
        });
    });

/**
 * 根据参数和页码获取用户已经加入的项目列表
 * @param pageSize 第几页
 * @param pageNum 一页的项目数量
 * @param params 查询参数
 */
export const findUserJoinedProjects = (pageSize, pageNum, params) =>
    new Promise((resolve, reject) => {
        const query = ProjectMemberModel.find(params);
        query.skip((pageNum - 1) * pageSize);
        query.limit(pageSize);
        query.exec((err, data) => {
            if (data.length < 1) {
                reject();
            }

            const projectIDs = data.map(function (item) {
                return {
                    projectId: item.projectId,
                };
            });

            resolve(projectIDs);
        });
    });