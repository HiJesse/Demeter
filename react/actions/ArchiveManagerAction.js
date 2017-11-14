// archive actions
import {ACTION_ARCHIVE_FETCH_ALL_PROJECTS} from "../constants/ActionType";

/**
 * 根据用户ID获取当前用户可以访问的项目列表
 * @param uId
 */
export const fetchAllProjectsAction = uId => ({
    type: ACTION_ARCHIVE_FETCH_ALL_PROJECTS,
    data: {
        uId: uId
    }
});