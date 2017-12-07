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
 * 根据参数和页码获取用户已经加入的项目列表
 * @param pageSize 第几页
 * @param pageNum 一页的项目数量
 * @param params 查询参数
 */
export const findUserJoinedProjectsa = (pageSize, pageNum, params) =>
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
            LogUtil.e(`${TAG} findProjectMember ${err}`);
            reject({findProjectMemberError: true})
        }
        resolve(users);
    });
});

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

/**
 * 获取用户已加入的项目列表
 * @param user
 */
export const findUserJoinedProjects = user => new Promise((resolve, reject) => {
    user.getProjects((err, projects) => {
        if (err) {
            LogUtil.e(`${TAG} findUserJoinedProjects ${err}`);
            reject({findUserJoinedProjectsError: true})
        }
        resolve(projects);
    });
});