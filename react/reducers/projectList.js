//project list reducer
import {ACTION_PROJECT_PAGE_LOADING} from "../constants/actionType";

const initialProjectListState = {
    projectCount: 0,
    projectList: [],
    pageNum: 1,
    pageSize: 10,
    pageLoading: false,
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
        default:
    }
    return newState;
}