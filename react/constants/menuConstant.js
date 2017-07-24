// home menu
import {isArrayEmpty, isStringEmpty} from "../../util/checker";

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

// 菜单项目管理
export const MENU_PROJECT_MANAGER = {
    key: 'project_manager',
    value: '项目管理',
    icon: 'appstore-o',
    MENU_SUB: [{
        key: 'project_manager_list',
        value: '项目列表',
    }, {
        key: 'project_manager_create',
        value: '新建项目',
    }, {
        key: 'project_manager_delete',
        value: '删除项目',
    }]
};

// 菜单用户管理
export const MENU_USER_MANAGER = {
    key: 'user_manager',
    value: '用户管理',
    icon: 'user',
    MENU_SUB: [{
        key: 'user_manager_list',
        value: '用户列表',
    }, {
        key: 'user_manager_create',
        value: '新建用户',
    }, {
        key: 'user_manager_reset',
        value: '重置密码',
    }]
};

// 菜单android包管理
export const MENU_ANDROID_PACKAGE = {
    key: 'package_android_manager',
    value: 'Android包管理',
    icon: 'android',
    MENU_SUB: [{
        key: 'package_android_manager_daily',
        value: 'DailyBuild',
    }, {
        key: 'package_android_manager_channel',
        value: '渠道包',
    }]
};

// 菜单ios包管理
export const MENU_IOS_PACKAGE = {
    key: 'package_ios_manager',
    value: 'IOS包管理',
    icon: 'apple',
    MENU_SUB: [{
        key: 'package_ios_manager_daily',
        value: 'DailyBuild',
    }, {
        key: 'package_ios_manager_channel',
        value: '渠道包',
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
        if (sub.key !== key) {
            continue;
        }
        value.subKey = sub.key;
        value.subValue = sub.value;
        break;
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
    } else if (key.startsWith(MENU_ANDROID_PACKAGE.key)) {
        values = getValueFromSpecificKey(key, MENU_ANDROID_PACKAGE);
    } else if (key.startsWith(MENU_IOS_PACKAGE.key)) {
        values = getValueFromSpecificKey(key, MENU_IOS_PACKAGE);
    }
    return values;
}