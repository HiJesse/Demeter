// base project member api
import * as LogUtil from "../../../util/LogUtil";

const TAG = 'BaseProjectMemberApi';

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
 * 判断用户是否已经加入项目 如果没加入则reject
 * @param members 项目成员
 * @param account 用户
 */
export const isUserJoinedProject = (members, account) => new Promise((resolve, reject) => {
    for (let i = 0; i < members.length; i++) {
        if (members[i].account === account) {
            resolve();
        }
    }
    reject({isNotJoinedProject: true})
});

/**
 * 判断用户是否未加入项目 如果加入了则reject
 * @param members 项目成员
 * @param account 用户
 */
export const isUserNotJoinedProject = (members, account) => new Promise((resolve, reject) => {
    for (let i = 0; i < members.length; i++) {
        if (members[i].account === account) {
            reject({isJoinedProject: true});
        }
    }
    resolve()
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
 * @param user 用户实例
 * @param projectParams 查询项目实例
 */
export const findUserJoinedProjects = (user, projectParams) => new Promise((resolve, reject) => {
    user.getProjects(projectParams, (err, projects) => {
        if (err) {
            LogUtil.e(`${TAG} findUserJoinedProjects ${err}`);
            reject({findUserJoinedProjectsError: true})
        }
        resolve(projects);
    });
});

/**
 * 删除项目成员
 * @param project 项目
 * @param member 成员
 */
export const deleteMemberInfo = (project, member) => new Promise((resolve, reject) => {
    project.removeUsers(member, err => {
        if (err) {
            LogUtil.e(`${TAG} deleteProjectMember ${err}`);
            reject({deleteProjectMemberError: true})
        }
        resolve();
    })
});