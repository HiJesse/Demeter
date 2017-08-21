import React from "react";
import {connect} from "react-redux";
import {Icon, Popconfirm, Table} from "antd";
import {homeStyle} from "./styles/home";
import {projectListView} from "./styles/projectListView";
import {projectPageLoadingAction} from "../actions/projectList";

// 用户管理-用户列表
class ProjectListView extends React.Component {

    componentDidMount() {
        // unused
    }

    render() {

        const columns = this._buildColumns();

        return (
            <div style={homeStyle.view_content}>
                <Table
                    bordered
                    dataSource={this.props.projectList}
                    columns={columns}
                    loading={this.props.pageLoading}
                    scroll={{y: true}}
                    pagination={{
                        total: this.props.userCount,
                        pageSize: this.props.pageSize,
                        current: this.props.pageNum
                    }}
                    onChange={(pagination) => {
                        this.props.pageLoadingVisible(true);
                    }}/>
            </div>
        );
    }

    /**
     * 根据数据构建出各个列
     * @private
     */
    _buildColumns() {
        return [{
            title: '项目',
            dataIndex: 'project',
            width: '15%',
            render: (text) => (<div>{text}</div>),
        }, {
            title: '平台',
            dataIndex: 'platform',
            width: '15%',
            render: (text, record, index) => this._buildPlatformView(index),
        }, {
            title: '简介',
            dataIndex: 'des',
            width: '15%',
            render: (text) => (<div>{text}</div>),
        }, {
            title: '行为',
            dataIndex: 'operation',
            render: (text, record, index) => this._buildOperationColumn(index),
        }];
    }

    /**
     * 构建表格中行为列
     * @param index
     * @returns {XML}
     * @private
     */
    _buildOperationColumn(index) {
        return (
            <span style={projectListView.view_operation}>
                <Popconfirm
                    title="确认删除项目?"
                    onConfirm={() => this.props.deleteProject('')}>
                    <a href="#">{'删除项目'}</a>
                </Popconfirm>
            </span>
        )
    }

    /**
     * 构建平台column
     * @param index 数据index
     * @returns {XML}
     * @private
     */
    _buildPlatformView(index) {
        return (
            <div style={projectListView.view_platform}>
                <Icon type={'android'}/>
                <Icon type={'apple'}/>
            </div>
        )
    }

}
function select(state) {
    const projectList = state.projectList;
    return {
        projectList: projectList.projectList, // 项目列表
        pageSize: projectList.pageSize, // 分页容量
        pageNum: projectList.pageNum, // 当前页码
        projectCount: projectList.projectCount, // 项目总数
        pageLoading: projectList.pageLoading, // 分页loading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        pageLoadingVisible: isLoading => dispatch(projectPageLoadingAction(isLoading)),
        deleteProject: projectId => dispatch()
    }
}

export default connect(select, mapDispatchToProps)(ProjectListView);