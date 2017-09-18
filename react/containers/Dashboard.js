import React from "react";
import echarts from "echarts/dist/echarts.common";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import {homeStyle} from "./styles/home";

// demeter 仪表盘
export default class Dashboard extends React.Component {

    componentDidMount() {
        const countChart = echarts.init(document.getElementById('countChart'));

        countChart.setOption({
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
                data: [3, 10]
            }]
        });
    }

    render() {
        return (
            <div style={homeStyle.view_content}>
                <div id="countChart" style={{height: 500}}/>
            </div>

        );
    }
}