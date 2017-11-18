// base archive api
import ArchiveSchema from "../../../models/ArchiveModel";


/**
 * 根据项目id和平台id, 创建项目的下属各个平台数据
 * @param params 构建参数
 */
export const createArchive = (params) => new Promise((resolve, reject) => {
    ArchiveSchema.create(params, (error) => {
        if (error) {
            reject({archiveCreated: false});
        } else {
            resolve({archiveCreated: true});
        }
    });
});