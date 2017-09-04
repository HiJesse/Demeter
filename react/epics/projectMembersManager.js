// project user manager epics
import {combineEpics} from "redux-observable";
import {ACTION_PROJECT_USER_ADD_ACCOUNT, ACTION_PROJECT_USER_ADD_ACCOUNT_FULFILLED} from "../constants/actionType";
import {AJAX_METHOD, ajaxRequest} from "../../util/ajax";
import {URL_ADD_MEMBER_TO_PROJECT} from "../constants/url";
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
 * 项目所属成员管理相关 epic方法汇总
 */
export const projectMembersManagerEpics = combineEpics(
    addMemberEpic,
);