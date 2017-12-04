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