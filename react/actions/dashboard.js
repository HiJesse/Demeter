// dashboard actions
import {ACTION_FETCH_DASHBOARD_DATA} from "../constants/actionType";

/**
 * 获取仪表盘所有数据
 * @param uId
 */
export const fetchDashboardAction = uId => ({
    type: ACTION_FETCH_DASHBOARD_DATA,
    data: {
        uId: uId
    }
});