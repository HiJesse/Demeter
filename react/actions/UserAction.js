// user actions
import {
    ACTION_CREATE_USER,
    ACTION_GET_USER_INFO,
    ACTION_LOGIN,
    ACTION_MODIFY_PASSWORD,
    ACTION_MODIFY_PASSWORD_UID,
    ACTION_RESET_PASSWORD,
    ACTION_UPDATE_USER_INFO
} from "../constants/ActionType";
import {md5} from "../../util/EncryptUtil";

/**
 * 登录action
 * @param account
 * @param pwd
 */
export const loginAction = (account, pwd) => ({
    type: ACTION_LOGIN,
    data: {
        account: account,
        password: md5(pwd)
    }
});

/**
 * 修改密码action
 * @param account
 * @param pwd
 * @param newPwd
 */
export const modifyPasswordAction = (account, pwd, newPwd) => ({
    type: ACTION_MODIFY_PASSWORD,
    data: {
        account: account,
        password: md5(pwd),
        newPassword: md5(newPwd)
    }
});

/**
 * 根据uId获取用户信息
 * @param uId
 */
export const getUserInfoAction = uId => ({
    type: ACTION_GET_USER_INFO,
    data: {
        uId: uId,
    }
});

/**
 * 根据uId和老密码修改新密码
 * @param uId
 * @param pwd
 * @param newPwd
 */
export const modifyPasswordByIdAction = (uId, pwd, newPwd) => ({
    type: ACTION_MODIFY_PASSWORD_UID,
    data: {
        uId: uId,
        password: md5(pwd),
        newPassword: md5(newPwd)
    }
});

/**
 * 根据uId更新用户基本信息
 * @param uId
 * @param nickName
 */
export const updateUserInfoAction = (uId, nickName) => ({
    type: ACTION_UPDATE_USER_INFO,
    data: {
        uId: uId,
        nickName: nickName
    }
});

/**
 * 创建新用户
 * @param account
 * @param uId
 */
export const createUserAction = (account, uId) => ({
    type: ACTION_CREATE_USER,
    data: {
        account: account,
        uId: uId
    }
});

/**
 * 重置用户密码
 * @param account
 * @param uId
 */
export const resetPasswordAction = (account, uId) => ({
    type: ACTION_RESET_PASSWORD,
    data: {
        account: account,
        uId: uId
    }
});