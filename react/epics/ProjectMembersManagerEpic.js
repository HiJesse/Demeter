// project user manager epics
import {combineEpics} from "redux-observable";
import {
    ACTION_DELETE_PROJECT_MEMBER,
    ACTION_DELETE_PROJECT_MEMBER_FULFILLED,
    ACTION_FETCH_PROJECT_MEMBER_LIST,
    ACTION_FETCH_PROJECT_MEMBER_LIST_FULFILLED,
    ACTION_PROJECT_USER_ADD_ACCOUNT,
    ACTION_PROJECT_USER_ADD_ACCOUNT_FULFILLED,
    ACTION_QUIT_PROJECT,
    ACTION_QUIT_PROJECT_FULFILLED
} from "../constants/ActionType";
import {AJAX_METHOD, ajaxRequest} from "../../util/AjaxUtil";
import {
    URL_ADD_MEMBER_TO_PROJECT,
    URL_DELETE_PROJECT_MEMBER,
    URL_FETCH_PROJECT_MEMBER_LIST,
    URL_QUIT_PROJECT
} from "../constants/Url";
import {isStringEmpty} from "../../util/CheckerUtil";

/**
 * 向项目中添加成员 epic
 * @param action$
 */
export const addMemberEpic = action$ =>
    action$.ofType(ACTION_PROJECT_USER_ADD_ACCOUNT)
        .mergeMap(action => {
            const data = action.data;
            const account = data.account;
            const projectId = data.projectId;
            if (isStringEmpty(projectId) ||
                isStringEmpty(account) ||
                account.length < 3) {
                return [];
            }
            return ajaxRequest({
                actionType: ACTION_PROJECT_USER_ADD_ACCOUNT_FULFILLED,
                method: AJAX_METHOD.POST,
                url: URL_ADD_MEMBER_TO_PROJECT,
                params: data
            })
        });

/**
 * 获取项目成员列表 epic
 * @param action$
 */
export const fetchProjectMemberListEpic = action$ =>
    action$.ofType(ACTION_FETCH_PROJECT_MEMBER_LIST)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_FETCH_PROJECT_MEMBER_LIST_FULFILLED,
            method: AJAX_METHOD.GET,
            url: URL_FETCH_PROJECT_MEMBER_LIST,
            params: action.data
        }));

/**
 * 删除项目成员 epic
 * @param action$
 */
export const deleteProjectMemberEpic = action$ =>
    action$.ofType(ACTION_DELETE_PROJECT_MEMBER)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_DELETE_PROJECT_MEMBER_FULFILLED,
            method: AJAX_METHOD.POST,
            url: URL_DELETE_PROJECT_MEMBER,
            params: action.data
        }));

/**
 * 退出项目 epic
 * @param action$
 */
export const quitProjectMemberEpic = action$ =>
    action$.ofType(ACTION_QUIT_PROJECT)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_QUIT_PROJECT_FULFILLED,
            method: AJAX_METHOD.POST,
            url: URL_QUIT_PROJECT,
            params: action.data
        }));

/**
 * 项目所属成员管理相关 epic方法汇总
 */
export const projectMembersManagerEpics = combineEpics(
    addMemberEpic,
    fetchProjectMemberListEpic,
    deleteProjectMemberEpic,
    quitProjectMemberEpic
);