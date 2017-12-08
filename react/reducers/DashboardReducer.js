// dashboard reducer
import {message} from "antd";
import {ACTION_FETCH_DASHBOARD_DATA, ACTION_FETCH_DASHBOARD_DATA_FULFILLED} from "../constants/ActionType";
import {RES_SUCCEED} from "../../api/status/Status";
/**
 * 根据提供的列数量 填充出配置数量表的信息
 * @param params
 */
const buildCountChartOption = (params) => ({
    title: {text: '数量统计'},
    tooltip: {},
    legend: {
        data: ['数量']
    },
    xAxis: {
        data: ["用户", "项目"]
    },
    yAxis: {},
    series: [{
        name: '数量',
        type: 'bar',
        data: [params.userCount, params.projectCount],
        itemStyle: {
            normal: {
                color: '#47a5e9'
            }
        }
    }]
});

/**
 * 获取仪表盘数据 reducer
 * @param state
 * @param action
 */
const fetchDashboardReducer = (state, action) => {
    let result = {
        ...state,
        fetchLoading: false
    };

    if (action.status !== RES_SUCCEED) {
        message.error(action.msg);
        return result;
    }

    result.countChartOpt = buildCountChartOption({
        userCount: action.data.userCount,
        projectCount: action.data.projectCount
    });

    return result;
};

const initialDashboard = {
    countChartOpt: buildCountChartOption({userCount: 0, projectCount: 0}), // 数量维度表配置
    fetchLoading: false, // 页面加载菊花
};

/**
 * dashboard reducer模块分发
 * @param state
 * @param action
 * @returns {*}
 */
export function dashboard(state = initialDashboard, action) {
    let newState = state;
    switch (action.type) {
        case ACTION_FETCH_DASHBOARD_DATA:
            newState = {
                ...state,
                fetchLoading: true
            };
            break;
        case ACTION_FETCH_DASHBOARD_DATA_FULFILLED:
            newState = fetchDashboardReducer(state, action.data);
            break;
        default:
    }
    return newState;
}