// dashboard epics
import {combineEpics} from "redux-observable";
import {ACTION_FETCH_DASHBOARD_DATA, ACTION_FETCH_DASHBOARD_DATA_FULFILLED} from "../constants/ActionType";
import {AJAX_METHOD, ajaxRequest} from "../../util/AjaxUtil";
import {URL_FETCH_DASHBOARD} from "../constants/Url";

/**
 * 获取仪表盘数据 epic
 * @param action$
 */
export const fetchDashboardDataEpic = action$ =>
    action$.ofType(ACTION_FETCH_DASHBOARD_DATA)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_FETCH_DASHBOARD_DATA_FULFILLED,
            method: AJAX_METHOD.GET,
            url: URL_FETCH_DASHBOARD,
            params: action.data
        }));


/**
 * dashboard相关 epic方法汇总
 */
export const dashboardEpics = combineEpics(
    fetchDashboardDataEpic,
);