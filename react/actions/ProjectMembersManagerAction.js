// project user manager actions
import {
    ACTION_DELETE_PROJECT_MEMBER,
    ACTION_FETCH_PROJECT_MEMBER_LIST,
    ACTION_INIT_PROJECT_MEMBER_DIALOG,
    ACTION_PROJECT_USER_ADD_ACCOUNT,
    ACTION_PROJECT_USER_MANAGER_CHANGE_ACCOUNT,
    ACTION_SELECT_PROJECT_MEMBER
} from "../constants/ActionType";

/**
 * 初始化弹窗数据
 */
export const initDialogDataAction = () => ({
    type: ACTION_INIT_PROJECT_MEMBER_DIALOG,
    data: {}
});

/**
 * 实时改变用户账号
 * @param account
 */
export const changeUserAccountAction = account => ({
    type: ACTION_PROJECT_USER_MANAGER_CHANGE_ACCOUNT,
    data: {
        addedAccount: account
    }
});

/**
 * 给projectId所属的项目添加账号为addedAccount的用户
 * @param uId 用户uId
 * @param projectId 当前项目Id
 * @param account 要添加的账号
 */
export const addMemberAction = (uId, projectId, account) => ({
    type: ACTION_PROJECT_USER_ADD_ACCOUNT,
    data: {
        uId: uId,
        projectId: projectId,
        account: account
    }
});

/**
 * 获取项目成员列表
 * @param params
 */
export const fetchMembersAction = params => ({
    type: ACTION_FETCH_PROJECT_MEMBER_LIST,
    data: {
        uId: params.uId,
        projectId: params.projectId,
        pageNum: params.pageNum,
        pageSize: params.pageSize
    }
});

/**
 * 获取index成员的信息
 * @param index
 */
export const selectMemberAction = index => ({
    type: ACTION_SELECT_PROJECT_MEMBER,
    data: {
        index: index
    }
});

/**
 * 删除项目成员列表
 * @param params
 */
export const deleteMemberAction = params => ({
    type: ACTION_DELETE_PROJECT_MEMBER,
    data: {
        uId: params.uId,
        projectId: params.projectId,
        userId: params.userId
    }
});