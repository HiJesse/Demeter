// archive manager
import {ACTION_ARCHIVE_FETCH_ALL_PROJECTS_FULFILLED} from "../constants/ActionType";

/**
 * 获取可访问项目列表 reducer
 * @param state
 * @param action
 */
const fetchAllProjectsReducer = (state, action) => {
    const projectList = action.data.projectList.map((item, index) => ({
        value: item.projectId,
        name: item.projectName
    }));

    return {
        ...state,
        projectList: projectList,
    };
};

const initialArchive = {
    projectList: [], // 项目列表
    platformList: [], // 平台列表
};

/**
 * dashboard reducer模块分发
 * @param state
 * @param action
 * @returns {*}
 */
export function archive(state = initialArchive, action) {
    let newState = state;
    switch (action.type) {
        case ACTION_ARCHIVE_FETCH_ALL_PROJECTS_FULFILLED:
            newState = fetchAllProjectsReducer(state, action.data);
            break;
        default:
    }
    return newState;
}