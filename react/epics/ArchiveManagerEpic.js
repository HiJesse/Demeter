// archive epics
import {combineEpics} from "redux-observable";
import {
    ACTION_ARCHIVE_FETCH_ALL_PROJECTS,
    ACTION_ARCHIVE_FETCH_ALL_PROJECTS_FULFILLED,
    ACTION_ARCHIVE_FETCH_ARCHIVES,
    ACTION_ARCHIVE_FETCH_ARCHIVES_FULFILLED
} from "../constants/ActionType";
import {AJAX_METHOD, ajaxRequest} from "../../util/AjaxUtil";
import {URL_FETCH_ARCHIVE_LIST, URL_FETCH_PROJECT_LIST} from "../constants/Url";

/**
 * 获取项目所有列表 epic
 * @param action$
 */
export const fetchProjectsEpic = action$ =>
    action$.ofType(ACTION_ARCHIVE_FETCH_ALL_PROJECTS)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_ARCHIVE_FETCH_ALL_PROJECTS_FULFILLED,
            method: AJAX_METHOD.GET,
            url: URL_FETCH_PROJECT_LIST,
            params: action.data
        }));

/**
 * 获取文档列表 epic
 * @param action$
 */
export const fetchArchivesEpic = action$ =>
    action$.ofType(ACTION_ARCHIVE_FETCH_ARCHIVES)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_ARCHIVE_FETCH_ARCHIVES_FULFILLED,
            method: AJAX_METHOD.GET,
            url: URL_FETCH_ARCHIVE_LIST,
            params: action.data
        }));


/**
 * archive epic方法汇总
 */
export const ArchiveManagerEpics = combineEpics(
    fetchProjectsEpic,
    fetchArchivesEpic
);