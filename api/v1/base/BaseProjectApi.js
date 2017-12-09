// project api
import ProjectPlatformModel from "../../../models/ProjectPlatformModel";

/**
 * 获取项目平台信息
 * @param params
 */
export const findProjectPlatforms = params => new Promise((resolve, reject) => {
    ProjectPlatformModel.find(params, (err, data) => {
        if (err || data.length < 1) {
            reject({projectPlatformSize: -1});
            return;
        }
        resolve(data);
    });
});