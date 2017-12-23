// 表单 规则
import {
    MSG_ACCOUNT,
    MSG_ARCHIVE_DES,
    MSG_NICKNAME,
    MSG_PASSWORD,
    MSG_PROJECT_DES,
    MSG_PROJECT_NAME
} from "./StringConstant";

/**
 * 账号规则
 * @type {{required: boolean, min: number, message}}
 */
export const FORM_RULE_ACCOUNT = {
    required: true,
    min: 3,
    message: MSG_ACCOUNT
};

/**
 * 密码规则
 * @type {{required: boolean, min: number, message}}
 */
export const FROM_RULE_PASSWORD = {
    required: true,
    min: 6,
    message: MSG_PASSWORD
};

/**
 * 昵称规则
 * @type {{required: boolean, min: number, message}}
 */
export const FROM_RULE_NICKNAME = {
    required: true,
    min: 2,
    message: MSG_NICKNAME
};

/**
 * 项目名称规则
 * @type {{required: boolean, min: number, message}}
 */
export const FROM_RULE_PROJECT_NAME = {
    required: true,
    min: 2,
    message: MSG_PROJECT_NAME
};

/**
 * 项目名称规则
 * @type {{required: boolean, min: number, message}}
 */
export const FROM_RULE_PROJECT_DES = {
    required: true,
    min: 3,
    message: MSG_PROJECT_DES
};

/**
 * 文档说明规则
 * @type {{required: boolean, min: number, message}}
 */
export const FROM_RULE_ARCHIVE_DES = {
    required: true,
    min: 3,
    message: MSG_ARCHIVE_DES
};