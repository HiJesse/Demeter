// array util

/**
 * 根据项目id将项目列表和平台信息列表合并为一个数组
 * 默认入参都是校验过的
 * @param projects
 * @param platforms
 */
export const concatProjectAndPlatformInfo = (projects, platforms) => projects.map((project) => {
    let android, ios;
    for (let i = 0; i < platforms.length; i++) {
        if (platforms[i].projectId === project.projectId &&
            platforms[i].platformId === '0') {
            android = platforms[i].appId
        } else if (platforms[i].projectId === project.projectId &&
            platforms[i].platformId === '1') {
            ios = platforms[i].appId
        }
    }

    return {
        ...project,
        androidAppId: android,
        iosAppId: ios
    }
});