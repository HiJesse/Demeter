import React from "react";
import echarts from "echarts/dist/echarts.common";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import {connect} from "react-redux";
import {fetchDashboardAction} from "../actions/DashboardAction";
import {getUID} from "../utils/StorageUtil";
import {Spin} from "antd";
import {dashboardStyle} from "./styles/DashboardStyle";
import {isObjectEmpty} from "../../util/CheckerUtil";

// demeter 仪表盘
class Dashboard extends React.Component {

    componentDidMount() {
        this.props.fetchDashboard();
    }

    componentWillReceiveProps(receivedProps) {
        if (this.props.countChartOpt !== receivedProps.countChartOpt && !isObjectEmpty(receivedProps.countChartOpt)) {
            this.countChart = echarts.init(document.getElementById('countChart'));
            this.countChart.setOption(receivedProps.countChartOpt);
        }

    }

    render() {
        return (
            <div style={{flex: 1}}>
                <Spin spinning={this.props.fetchLoading} delay={500}>
                    <div id="countChart" style={dashboardStyle.chart_count}/>
                </Spin>
            </div>
        );
    }
}


function select(state) {
    const dashboard = state.dashboard;
    return {
        fetchLoading: dashboard.fetchLoading, // 页面加载菊花
        countChartOpt: dashboard.countChartOpt, // 数量维度表配置
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchDashboard: () => dispatch(fetchDashboardAction(getUID())),
    }
}

export default connect(select, mapDispatchToProps)(Dashboard);