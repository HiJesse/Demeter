//project list reducer
import {
    ACTION_FETCH_PROJECT_LIST_FULFILLED,
    ACTION_PROJECT_PAGE_LOADING,
    ACTION_UPDATE_PROJECT_DIALOG_VISIBLE
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
            pageLoading: false
        };
    }

    const projectList = action.data.projectList.map(function (item, index) {
        return {
            key: index,
            project: {
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
        projectCount: action.data.userCount,
        pageNum: action.data.pageNum,
        pageLoading: false,
    };
};

const initialProjectListState = {
    projectCount: 0,
    projectList: [],
    pageNum: 1,
    pageSize: 10,
    pageLoading: false,
    updateDialogVisible: false
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
        case ACTION_FETCH_PROJECT_LIST_FULFILLED:
            newState = fetchProjectListReducer(state, action.data);
            break;
        case ACTION_UPDATE_PROJECT_DIALOG_VISIBLE:
            newState = {
                ...state,
                updateDialogVisible: action.data.updateDialogVisible
            };
            break;
        default:
    }
    return newState;
}