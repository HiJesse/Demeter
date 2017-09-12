//project list reducer
import {
    ACTION_CHANGE_SEARCH_PROJECT_INPUT,
    ACTION_CHANGE_SEARCH_PROJECT_INPUT_VISIBLE,
    ACTION_DELETE_PROJECT_DIALOG_VISIBLE,
    ACTION_FETCH_JOINED_PROJECT_LIST_FULFILLED,
    ACTION_FETCH_PROJECT_LIST_FULFILLED,
    ACTION_PROJECT_PAGE_LOADING,
    ACTION_PROJECT_USER_MANAGER_DIALOG_VISIBLE,
    ACTION_UPDATE_PROJECT_DIALOG_VISIBLE,
    ACTION_UPDATING_PROJECT_INFO
} from "../constants/actionType";
import {RES_SUCCEED} from "../../util/status";
import {message} from "antd";

/**
 * 获取项目列表
 * @param state
 * @param action
 * @returns {*}
 */
const fetchProjectListReducer = (state, action) => {
    const succeed = action.status === RES_SUCCEED;
    if (!succeed) {
        message.error(action.msg);
        return {
            ...state,
            projectList: [],
            pageLoading: false
        };
    }

    const projectList = action.data.projectList.map(function (item, index) {
        return {
            key: index,
            project: {
                id: item.projectId,
                logo: item.avatar,
                name: item.projectName
            },
            platform: {
                android: item.androidAppId,
                ios: item.iosAppId
            },
            des: item.des,
            createdDate: item.createdDate
        };
    });

    return {
        ...state,
        projectList: projectList,
        projectCount: action.data.projectCount,
        pageNum: action.data.pageNum,
        pageLoading: false,
    };
};

/**
 * 获取当前选中要更新的项目的信息
 * @param state
 * @param action
 * @returns {{updateProjectInfo: {}}}
 */
const setUpdatingProjectInfoReducer = (state, action) => {
    const index = action.updateProjectIndex;
    let updateProjectInfo = {};

    if (index >= 0 && state.projectList.length > index) {
        const info = state.projectList[index];
        updateProjectInfo.id = info.project.id;
        updateProjectInfo.logo = info.project.logo;
        updateProjectInfo.name = info.project.name;
        updateProjectInfo.des = info.des;
    }

    return {
        ...state,
        updateProjectInfo: updateProjectInfo
    }
};

const initialProjectListState = {
    projectCount: 0,
    projectList: [],
    pageNum: 1,
    pageSize: 10,
    pageLoading: false,
    updateDialogVisible: false,
    deleteDialogVisible: false,
    userManagerVisible: false,
    updateProjectInfo: {},
    projectSearch: null,
    searchInputVisible: false,
};

/**
 * project list模块分发
 * @param state
 * @param action
 * @returns {*}
 */
export function projectList(state = initialProjectListState, action) {
    let newState = state;
    switch (action.type) {
        case ACTION_PROJECT_PAGE_LOADING:
            newState = {
                ...state,
                pageLoading: action.data.pageLoading
            };
            break;
        case ACTION_FETCH_JOINED_PROJECT_LIST_FULFILLED:
        case ACTION_FETCH_PROJECT_LIST_FULFILLED:
            newState = fetchProjectListReducer(state, action.data);
            break;
        case ACTION_UPDATE_PROJECT_DIALOG_VISIBLE:
            newState = {
                ...state,
                updateDialogVisible: action.data.updateDialogVisible
            };
            break;
        case ACTION_UPDATING_PROJECT_INFO:
            newState = setUpdatingProjectInfoReducer(state, action.data);
            break;
        case ACTION_DELETE_PROJECT_DIALOG_VISIBLE:
            newState = {
                ...state,
                deleteDialogVisible: action.data.deleteDialogVisible
            };
            break;
        case ACTION_CHANGE_SEARCH_PROJECT_INPUT:
            newState = {
                ...state,
                projectSearch: action.data.projectSearch
            };
            break;
        case ACTION_CHANGE_SEARCH_PROJECT_INPUT_VISIBLE:
            newState = {
                ...state,
                searchInputVisible: action.data.searchInputVisible
            };
            break;
        case ACTION_PROJECT_USER_MANAGER_DIALOG_VISIBLE:
            newState = {
                ...state,
                userManagerVisible: action.data.userManagerDialogVisible
            };
            break;
        default:
    }
    return newState;
}