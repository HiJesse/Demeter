// archive manager
import {
    ACTION_ARCHIVE_FETCH_ALL_PROJECTS_FULFILLED,
    ACTION_ARCHIVE_SELECT_PLATFORM,
    ACTION_ARCHIVE_SELECT_PROJECT
} from "../constants/ActionType";

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
    selectedProject: null, // 已选择的项目
    selectedPlatform: null, // 已选择的平台
    projectList: [], // 项目列表
    platformList: [{
        value: 0,
        name: 'Android'
    }, {
        value: 1,
        name: 'IOS'
    }], // 平台列表
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
        case ACTION_ARCHIVE_SELECT_PROJECT:
            newState = {
                ...state,
                selectedProject: action.data.selectedProject
            };
            break;
        case ACTION_ARCHIVE_SELECT_PLATFORM:
            newState = {
                ...state,
                selectedPlatform: action.data.selectedPlatform
            };
            break;
        case ACTION_ARCHIVE_FETCH_ALL_PROJECTS_FULFILLED:
            newState = fetchAllProjectsReducer(state, action.data);
            break;
        default:
    }
    return newState;
}