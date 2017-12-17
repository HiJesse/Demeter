//project list reducer
import {
    ACTION_CHANGE_SEARCH_PROJECT_INPUT,
    ACTION_CHANGE_SEARCH_PROJECT_INPUT_VISIBLE,
    ACTION_DELETE_PROJECT_DIALOG_VISIBLE,
    ACTION_FETCH_JOINED_PROJECT_LIST_FULFILLED,
    ACTION_FETCH_PROJECT_LIST_FULFILLED,
    ACTION_PROJECT_PAGE_LOADING,
    ACTION_PROJECT_QUIT_PROJECT_DIALOG_VISIBLE,
    ACTION_PROJECT_USER_MANAGER_DIALOG_VISIBLE,
    ACTION_QUIT_PROJECT,
    ACTION_QUIT_PROJECT_FULFILLED,
    ACTION_UPDATE_PROJECT_DIALOG_VISIBLE,
    ACTION_UPDATING_PROJECT_INFO
} from "../constants/ActionType";
import {RES_SUCCEED} from "../../api/status/Status";
import {message} from "antd";
import {isStringEmpty} from "../../util/CheckerUtil";
import * as React from "react";
import {formatDate} from "../../util/TimeUtil";

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
            pageLoading: false,
            needRefresh: false,
        };
    }

    const projectList = action.data.projectList.map(function (item, index) {
        return {
            key: index,
            project: {
                id: item.id,
                logo: item.avatar,
                name: item.projectName
            },
            platform: {
                android: item.androidAppId,
                ios: item.iosAppId
            },
            des: item.des,
            createdDate: formatDate(item.createdAt),
        };
    });

    return {
        ...state,
        projectList: projectList,
        projectCount: action.data.projectCount,
        pageNum: action.data.pageNum,
        pageLoading: false,
        needRefresh: false,
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

/**
 * 显示退出项目弹窗 reducer
 * @param state
 * @param action
 */
const showQuitingProjectDialogReducer = (state, action) => {
    const index = action.index;
    let projectInfo = {};

    if (index >= 0 && state.projectList.length > index) {
        const info = state.projectList[index];
        projectInfo.id = info.project.id;
        projectInfo.logo = info.project.logo;
        projectInfo.name = info.project.name;
        projectInfo.des = info.des;
    }

    const projectName = isStringEmpty(projectInfo.name) ? '' : projectInfo.name;

    return {
        ...state,
        updateProjectInfo: projectInfo,
        dialogVisible: action.visible,
        confirmTitle: `退出 ${projectName} 项目`,
        confirmContent: (<div>{`确认退出 ${projectName} 项目吗?`}</div>),
        confirmLoading: false
    }
};

/**
 * 退出项目 reducer
 * @param state
 * @param action
 */
const quitProjectDialogReducer = (state, action) => {
    const succeed = action.status === RES_SUCCEED;

    let returnData = {
        ...state,
        confirmLoading: false,
        dialogVisible: false,
        updateProjectInfo: {},
    };

    if (!succeed) {
        message.error(action.msg);
        returnData.needRefresh = false;
    } else {
        returnData.needRefresh = true;
    }

    return returnData;
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
    dialogVisible: false,
    confirmLoading: false,
    confirmTitle: '确认',
    confirmContent: null,
    needRefresh: false,
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
        case ACTION_PROJECT_QUIT_PROJECT_DIALOG_VISIBLE:
            newState = showQuitingProjectDialogReducer(state, action.data);
            break;
        case ACTION_QUIT_PROJECT:
            newState = {
                ...state,
                confirmLoading: true
            };
            break;
        case ACTION_QUIT_PROJECT_FULFILLED:
            newState = quitProjectDialogReducer(state, action.data);
            break;
        default:
    }
    return newState;
}