import React from "react";
import {connect} from "react-redux";
import {Icon, Popconfirm, Table} from "antd";
import {homeStyle} from "./styles/home";
import {projectListViewStyle} from "./styles/projectListView";
import {fetchProjectListAction, projectPageLoadingAction} from "../actions/projectList";
import {isStringEmpty} from "../../util/checker";

// 用户管理-用户列表
class ProjectListView extends React.Component {

    componentDidMount() {
        this.props.pageLoadingVisible(true);
        this.props.fetchProjectList(this.props.pageSize, this.props.pageNum, '');
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
            render: (text) => this._buildProjectInfoView(text),
        }, {
            title: '平台',
            dataIndex: 'platform',
            width: '15%',
            render: (text) => this._buildPlatformView(text),
        }, {
            title: '简介',
            dataIndex: 'des',
            width: '15%',
            render: (text) => (<div>{text}</div>),
        }, {
            title: '创建日期',
            dataIndex: 'createdDate',
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
            <span style={projectListViewStyle.view_operation}>
                <Popconfirm
                    title="确认删除项目?"
                    onConfirm={() => this.props.deleteProject('')}>
                    <a href="#">{'删除项目'}</a>
                </Popconfirm>
            </span>
        )
    }

    /**
     * 构建项目名称和logo column
     * @param info
     * @returns {XML}
     * @private
     */
    _buildProjectInfoView(info) {
        return (
            <div style={projectListViewStyle.view_project}>
                <img
                    style={projectListViewStyle.image_logo}
                    src={isStringEmpty(info.logo) ? '' : info.logo}/>
                <div style={projectListViewStyle.text_project_name}>
                    {info.name}
                </div>
            </div>
        )
    }

    /**
     * 构建平台column
     * @param info 平台相关数据
     * @returns {XML}
     * @private
     */
    _buildPlatformView(info) {
        return (
            <div style={projectListViewStyle.view_platform}>
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
        fetchProjectList: (pageSize, pageNum, projectName) =>
            dispatch(fetchProjectListAction(localStorage.uId, pageSize, pageNum, projectName)),
        pageLoadingVisible: isLoading => dispatch(projectPageLoadingAction(isLoading)),
        deleteProject: projectId => dispatch()
    }
}

export default connect(select, mapDispatchToProps)(ProjectListView);