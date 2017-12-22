// home menu
import {isArrayEmpty, isStringEmpty} from "../../util/CheckerUtil";

export const USER_CENTER = 'user_center';
export const USER_CENTER_INFO = 'user_center_info';
export const USER_CENTER_PASSWORD = 'user_center_password';

// 个人中心
export const MENU_USER_CENTER = {
    key: USER_CENTER,
    value: '个人中心',
    icon: 'smile',
    MENU_SUB: [{
        key: USER_CENTER_INFO,
        value: '基本信息',
    }, {
        key: USER_CENTER_PASSWORD,
        value: '修改密码',
    }]
};

export const PROJECT_MANAGER_LIST = 'project_manager_list';
export const PROJECT_MANAGER_CREATE = 'project_manager_create';
// 菜单项目管理
export const MENU_PROJECT_MANAGER = {
    key: 'project_manager',
    value: '项目管理',
    icon: 'appstore-o',
    MENU_SUB: [{
        key: PROJECT_MANAGER_LIST,
        value: '项目列表',
    }, {
        key: PROJECT_MANAGER_CREATE,
        value: '新建项目',
    }]
};

// 菜单已加入项目列表
export const MENU_JOINED_PROJECT_LIST = {
    key: 'project_joined_list',
    value: '项目列表',
    icon: 'appstore-o'
};

export const USER_MANAGER_CREATE = 'user_manager_create';
export const USER_MANAGER_RESET_PWD = 'user_manager_reset_pwd';
export const USER_MANAGER_LIST = 'user_manager_list';
// 菜单用户管理
export const MENU_USER_MANAGER = {
    key: 'user_manager',
    value: '用户管理',
    icon: 'user',
    MENU_SUB: [{
        key: USER_MANAGER_LIST,
        value: '用户列表',
    }, {
        key: USER_MANAGER_CREATE,
        value: '新建用户',
    }, {
        key: USER_MANAGER_RESET_PWD,
        value: '重置密码',
    }]
};

// 归档管理
export const ARCHIVE_MANAGER_LIST = 'archive_manager_list';
export const ARCHIVE_MANAGER_CREATE = 'archive_manager_create';
export const ARCHIVE_MANAGER = {
    key: 'archive_manager',
    value: '归档管理',
    icon: 'file',
    MENU_SUB: [{
        key: ARCHIVE_MANAGER_LIST,
        value: '归档列表',
    }, {
        key: ARCHIVE_MANAGER_CREATE,
        value: '新建归档',
    }]
};

/**
 * 根据特定的key, 从特定的data中拿到val
 * @param key
 * @param data
 * @returns {{value}}
 */
function getValueFromSpecificKey(key, data) {
    const value = {
        key: data.key,
        value: data.value,
        icon: data.icon
    };

    if (isArrayEmpty(data.MENU_SUB)) {
        return value;
    }

    for (let i = 0; i < data.MENU_SUB.length; i++) {
        const sub = data.MENU_SUB[i];
        if (sub.key === key) {
            value.subKey = sub.key;
            value.subValue = sub.value;
            break;
        }
    }
    return value;
}

/**
 * 根据菜单点击返回的key, 选出子菜单名称和次级菜单名称
 * @param key
 * @returns {{}}
 */
export function getValuesFromKey(key) {
    let values = {};
    if (isStringEmpty(key)) {
        return values;
    }

    if (key.startsWith(MENU_USER_CENTER.key)) {
        values = getValueFromSpecificKey(key, MENU_USER_CENTER);
    } else if (key.startsWith(MENU_PROJECT_MANAGER.key)) {
        values = getValueFromSpecificKey(key, MENU_PROJECT_MANAGER);
    } else if (key.startsWith(MENU_USER_MANAGER.key)) {
        values = getValueFromSpecificKey(key, MENU_USER_MANAGER);
    } else if (key.startsWith(MENU_JOINED_PROJECT_LIST.key)) {
        values = {
            key: MENU_JOINED_PROJECT_LIST.key,
            value: MENU_JOINED_PROJECT_LIST.value,
        };
    } else if (key.startsWith(ARCHIVE_MANAGER.key)) {
        values = getValueFromSpecificKey(key, ARCHIVE_MANAGER);
    }
    return values;
}

/**
 * 根据用户权限和菜单详情 决定是否要绘制该菜单
 * @param isAdmin
 * @param menu
 * @returns {boolean}
 */
export const willRenderMenu = (isAdmin, menu) => {
    let willRender = true;
    if (isAdmin && menu === MENU_JOINED_PROJECT_LIST) {
        willRender = false;
    } else if (!isAdmin) {
        switch (menu) {
            case MENU_PROJECT_MANAGER:
            case MENU_USER_MANAGER:
                willRender = false;
                break;
            default:
                willRender = true;
        }
    }
    return willRender;
};