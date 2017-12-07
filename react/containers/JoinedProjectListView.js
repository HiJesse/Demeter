import React from "react";
import {connect} from "react-redux";
import {Icon, Popover, Table} from "antd";
import {projectListViewStyle} from "./styles/ProjectListViewStyle";
import {
    fetchJoinedProjectListAction,
    projectPageLoadingAction,
    quitProjectAction,
    showQuitingProjectDialogAction
} from "../actions/ProjectListAction";
import {isStringEmpty} from "../../util/CheckerUtil";
import ConfirmDialog from "../components/ConfirmDialog";
import {getUID} from "../utils/StorageUtil";

// 已加入的项目列表
class JoinedProjectListView extends React.Component {

    componentDidMount() {
        this._refreshPage();
    }

    render() {

        if (this.props.needRefresh) {
            this._refreshPage();
        }

        return (
            <div style={projectListViewStyle.view_all}>
                <ConfirmDialog
                    dialogVisible={this.props.dialogVisible}
                    confirmLoading={this.props.confirmLoading}
                    title={this.props.confirmTitle}
                    content={this.props.confirmContent}
                    onDismiss={() => {
                        this.props.showQuitingProjectDialog(false, -1);
                    }}
                    onConfirm={() => {
                        this.props.quitProject(this.props.updateProjectInfo.id);
                    }}
                />
                <Table
                    bordered
                    dataSource={this.props.projectList}
                    columns={this._buildColumns()}
                    loading={this.props.pageLoading}
                    scroll={{y: true}}
                    pagination={{
                        total: this.props.projectCount,
                        pageSize: this.props.pageSize,
                        current: this.props.pageNum
                    }}
                    onChange={(pagination) => {
                        this.props.pageLoadingVisible(true);
                        this.props.fetchProjectList(pagination.pageSize, pagination.current);
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
            width: '8%',
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
            title: '操作',
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
                <a href="#" onClick={() => {
                    this.props.showQuitingProjectDialog(true, index);
                }}>{'退出项目'}</a>
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
                <Popover content={info.android} title="Android AppID">
                    <Icon type={'android'}/>
                </Popover>

                <Popover content={info.ios} title="IOS AppID">
                    <Icon type={'apple'}/>
                </Popover>
            </div>
        )
    }

    /**
     * 刷新当前列表数据
     * @private
     */
    _refreshPage() {
        this.props.pageLoadingVisible(true);
        this.props.fetchProjectList(this.props.pageSize, this.props.pageNum);
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
        dialogVisible: projectList.dialogVisible, // 弹窗是否显示
        confirmLoading: projectList.confirmLoading, // 弹窗确认按钮菊花
        confirmTitle: projectList.confirmTitle, // 弹窗标题
        confirmContent: projectList.confirmContent, // 弹窗标题
        updateProjectInfo: projectList.updateProjectInfo, // 选中的项目信息
        needRefresh: projectList.needRefresh, // 是否需要刷新列表
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProjectList: (pageSize, pageNum) =>
            dispatch(fetchJoinedProjectListAction(getUID(), pageSize, pageNum)),
        pageLoadingVisible: isLoading => dispatch(projectPageLoadingAction(isLoading)),
        showQuitingProjectDialog: (visible, index) => dispatch(showQuitingProjectDialogAction(visible, index)),
        quitProject: projectId => dispatch(quitProjectAction(getUID(), projectId))
    }
}

export default connect(select, mapDispatchToProps)(JoinedProjectListView);