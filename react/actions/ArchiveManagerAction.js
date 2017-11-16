// archive actions
import {ACTION_ARCHIVE_FETCH_ALL_PROJECTS, ACTION_ARCHIVE_FETCH_ARCHIVES} from "../constants/ActionType";

/**
 * 根据用户ID获取当前用户可以访问的项目列表
 * @param uId
 */
export const fetchAllProjectsAction = uId => ({
    type: ACTION_ARCHIVE_FETCH_ALL_PROJECTS,
    data: {
        uId: uId,
        pageSize: 100,
    }
});

/**
 * 根据用户ID 项目id 平台id获取对应的文档
 * @param uId
 * @param projectId
 * @param platformId
 */
export const fetchArchivesAction = (uId, projectId, platformId) => ({
    type: ACTION_ARCHIVE_FETCH_ARCHIVES,
    data: {
        uId: uId,
        projectId: projectId,
        platformId: platformId,
    }
});