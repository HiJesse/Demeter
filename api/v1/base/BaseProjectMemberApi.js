// base project member api
import ProjectMemberModel from "../../../models/ProjectMemberModel";
import * as LogUtil from "../../../util/LogUtil";

const TAG = 'BaseProjectMemberApi';

/**
 * 删除项目成员
 * @param projectId
 * @param userId
 */
export const deleteMember = (projectId, userId) => new Promise((resolve, reject) => {
    ProjectMemberModel.remove({
        projectId: projectId,
        userId: userId
    }, (err) => {
        if (err) {
            reject({projectMemberDeleted: false});
        } else {
            resolve({projectMemberDeleted: true});
        }
    });
});

/**
 * 删除项目所有成员
 * @param projectId
 */
export const deleteAllMembers = (projectId) => new Promise((resolve, reject) => {
    ProjectMemberModel.remove({
        projectId: projectId,
    }, (err) => {
        if (err) {
            reject({projectAllMemberDeleted: false});
        } else {
            resolve({projectAllMemberDeleted: true});
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


/**
 * 查找项目成员
 * @param project
 */
export const findProjectMember = (project) => new Promise((resolve, reject) => {
    project.getUsers((err, users) => {
        if (err) {
            LogUtil.e(`${TAG} findProjectMember pages ${err}`);
            reject({findProjectMemberError: true})
        }
        resolve(users);
    });
});

/**
 * 按照页面容量和页面数切割项目成员
 * @param members 成员
 * @param pageSize 页面容量
 * @param pageNum 页码
 * @returns {Array} 对应页面的成员列表
 */
export const splitMembersByPage = (members, pageSize, pageNum) => {
    const pageStart = pageSize * (pageNum - 1);

    // 要查询的数量高于总数量则直接返回空组数
    if (members.length < pageStart) {
        return [];
    }

    let onePage = [];

    // 在成员长度内遍历出需要的一页成员
    for (let i = pageStart; (i < pageSize * pageNum && i < members.length); i++) {
        onePage.push(members[i]);
    }

    return onePage;
};


/**
 * 判断用户是否已经加入项目
 * @param members 项目成员
 * @param account 用户
 */
export const isUserJoinedProject = (members, account) => new Promise((resolve, reject) => {
    for (const projectMember in members) {
        if (projectMember.account === account) {
            reject();
        }
    }
    resolve({isNotJoinedProject: true})
});

/**
 * 添加项目成员
 * @param project 项目
 * @param member 成员
 */
export const createProjectMemberInfo = (project, member) => new Promise((resolve, reject) => {
    project.addUsers(member, err => {
        if (err) {
            LogUtil.e(`${TAG} addProjectMember ${err}`);
            reject({addProjectMemberError: true})
        }
        resolve();
    })
});