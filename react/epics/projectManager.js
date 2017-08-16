// project manager epics
import {combineEpics} from "redux-observable";
import {ACTION_CREATE_PROJECT, ACTION_CREATE_PROJECT_FULFILLED} from "../constants/actionType";
import {AJAX_METHOD, ajaxRequest} from "../../util/ajax";
import {URL_CREATE_PROJECT} from "../constants/url";

/**
 * 创建项目epic
 * @param action$
 */
export const createProjectEpic = action$ =>
    action$.ofType(ACTION_CREATE_PROJECT)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_CREATE_PROJECT_FULFILLED,
            method: AJAX_METHOD.POST_FORM,
            url: URL_CREATE_PROJECT,
            params: action.data
        }));

/**
 * user list相关 epic方法汇总
 */
export const projectManagerEpics = combineEpics(
    createProjectEpic,
);