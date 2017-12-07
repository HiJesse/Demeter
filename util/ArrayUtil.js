// array util
import {isStringEmpty} from "./CheckerUtil";
import {URL_PROJECT_LOGO, URL_PROJECT_LOGO_DEFAULT} from "./PathUtil";


/**
 * 将项目列表中的平台信息展开
 * @param projects
 */
export const concatProjectAndPlatformInfo = (projects) => projects.map((project) => {
    let android, ios;
    const platforms = project.platforms;

    /**
     * 遍历平台信息
     */
    for (let i = 0; i < platforms.length; i++) {
        if (platforms[i].platformId === 0) {
            android = platforms[i].appId
        } else if (platforms[i].platformId === 1) {
            ios = platforms[i].appId
        }
    }

    // 填充头像
    project.avatar = isStringEmpty(project.avatar) ?
        URL_PROJECT_LOGO_DEFAULT :
        URL_PROJECT_LOGO + project.avatar;

    return {
        ...project,
        androidAppId: android,
        iosAppId: ios
    }
});

/**
 * 按照页面容量和页面数切割数组
 * @param data 数组数据
 * @param pageSize 页面容量
 * @param pageNum 页码
 * @returns {Array} 切割后的数组
 */
export const splitListByPage = (data, pageSize, pageNum) => {
    const pageStart = pageSize * (pageNum - 1);

    // 要查询的数量高于总数量则直接返回空组数
    if (data.length < pageStart) {
        return [];
    }

    let onePage = [];

    // 在成员长度内遍历出需要的一页成员
    for (let i = pageStart; (i < pageSize * pageNum && i < data.length); i++) {
        onePage.push(data[i]);
    }

    return onePage;
};