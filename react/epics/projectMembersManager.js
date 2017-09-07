// project user manager epics
import {combineEpics} from "redux-observable";
import {
    ACTION_FETCH_PROJECT_MEMBER_LIST,
    ACTION_FETCH_PROJECT_MEMBER_LIST_FULFILLED,
    ACTION_PROJECT_USER_ADD_ACCOUNT,
    ACTION_PROJECT_USER_ADD_ACCOUNT_FULFILLED
} from "../constants/actionType";
import {AJAX_METHOD, ajaxRequest} from "../../util/ajax";
import {URL_ADD_MEMBER_TO_PROJECT, URL_FETCH_PROJECT_MEMBER_LIST} from "../constants/url";
import {isStringEmpty} from "../../util/checker";

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
 * 项目所属成员管理相关 epic方法汇总
 */
export const projectMembersManagerEpics = combineEpics(
    addMemberEpic,
    fetchProjectMemberListEpic
);