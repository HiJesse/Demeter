// user list epics
import {ACTION_FETCH_USER_LIST, ACTION_FETCH_USER_LIST_FULFILLED} from "../constants/actionType";
import {ajaxGet} from "../../util/ajax";
import {URL_FETCH_USER_LIST} from "../constants/url";
import {Observable} from "rxjs";

/**
 * 获取用户列表 epic
 * @param action$
 */
export const fetchUserListEpic = action$ =>
    action$.ofType(ACTION_FETCH_USER_LIST)
        .mergeMap(action => ajaxGet(URL_FETCH_USER_LIST, action.data)
            .map(data => {
                return ({
                    type: ACTION_FETCH_USER_LIST_FULFILLED,
                    data: data
                })
            })
            .catch(e => Observable.of({
                type: ACTION_FETCH_USER_LIST_FULFILLED,
                data: e
            }))
        );