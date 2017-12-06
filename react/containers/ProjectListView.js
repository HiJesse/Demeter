import React from "react";
import {connect} from "react-redux";
import {Button, Icon, Input, Popover, Table} from "antd";
import {projectListViewStyle} from "./styles/ProjectListViewStyle";
import {
    changeSearchInputAction,
    changeSearchVisibleAction,
    fetchProjectListAction,
    projectPageLoadingAction,
    setUpdatingProjectInfoAction,
    showDeletingDialogAction,
    showUpdateDialogAction,
    showUserManagerDialogAction
} from "../actions/ProjectListAction";
import {isStringEmpty} from "../../util/CheckerUtil";
import UpdateProjectInfoDialog from "../components/UpdateProjectInfoDialog";
import DeleteProjectDialog from "../components/DeleteProjectDialog";
import ProjectMembersManagerDialog from "../components/ProjectMembersManagerDialog";
import {getUID} from "../utils/StorageUtil";

// 项目管理-项目列表分页
class ProjectListView extends React.Component {

    componentDidMount() {
        this._refreshPage();
    }

    render() {
        const columns = this._buildColumns();

        return (
            <div style={projectListViewStyle.view_all}>
                <UpdateProjectInfoDialog
                    data={this.props.updateProjectInfo}
                    dialogVisible={this.props.updateDialogVisible}
                    onDismiss={() => {
                        this.props.setUpdatingProjectInfo(-1);
                        this.props.showUpdateDialog(false);
                    }}
                    onConfirm={() => {
                        this.props.setUpdatingProjectInfo(-1);
                        this.props.showUpdateDialog(false);
                        this._refreshPage();
                    }}/>
                <DeleteProjectDialog
                    data={this.props.updateProjectInfo}
                    dialogVisible={this.props.deleteDialogVisible}
                    onDismiss={() => {
                        this.props.setUpdatingProjectInfo(-1);
                        this.props.showDeleteDialog(false);
                    }}
                    onConfirm={() => {
                        this.props.setUpdatingProjectInfo(-1);
                        this.props.showDeleteDialog(false);
                        this._refreshPage();
                    }}/>
                <ProjectMembersManagerDialog
                    data={this.props.updateProjectInfo}
                    dialogVisible={this.props.userManagerVisible}
                    onDismiss={() => {
                        this.props.setUpdatingProjectInfo(-1);
                        this.props.showUserManagerDialog(false)
                    }}/>
                <Table
                    bordered
                    dataSource={this.props.projectList}
                    columns={columns}
                    loading={this.props.pageLoading}
                    scroll={{y: true}}
                    pagination={{
                        total: this.props.projectCount,
                        pageSize: this.props.pageSize,
                        current: this.props.pageNum
                    }}
                    onChange={(pagination) => {
                        this.props.pageLoadingVisible(true);
                        this.props.fetchProjectList(pagination.pageSize, pagination.current, this.props.projectSearch);
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
            filterDropdown: (
                <div style={projectListViewStyle.view_search}>
                    <Input
                        placeholder="项目"
                        value={this.props.projectSearch}
                        onChange={(e) => this.props.changeSearchInput(e.target.value)}
                        onPressEnter={this._onSearch.bind(this)}
                    />
                    <Button
                        type="primary"
                        style={projectListViewStyle.button_search}
                        onClick={this._onSearch.bind(this)}>搜索</Button>
                </div>
            ),
            filterIcon: <Icon type="search" style={projectListViewStyle.icon_search}/>,
            filterDropdownVisible: this.props.searchInputVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.props.changeSearchVisible(visible);
            },
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
                    this.props.setUpdatingProjectInfo(index);
                    this.props.showUpdateDialog(true);
                }}>{'更新信息'}</a>

                <a href="#" onClick={() => {
                    this.props.setUpdatingProjectInfo(index);
                    this.props.showUserManagerDialog(true);
                }}>{'成员管理'}</a>

                <a href="#" onClick={() => {
                    this.props.setUpdatingProjectInfo(index);
                    this.props.showDeleteDialog(true);
                }}>{'删除项目'}</a>
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
        this.props.fetchProjectList(this.props.pageSize, this.props.pageNum, this.props.projectSearch);
    }

    /**
     * 搜索回调
     * @private
     */
    _onSearch() {
        this.props.changeSearchVisible(false);
        this.props.pageLoadingVisible(true);
        this.props.fetchProjectList(this.props.pageSize, 1, this.props.projectSearch);
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
        updateDialogVisible: projectList.updateDialogVisible, // 是否显示更新项目信息弹窗
        deleteDialogVisible: projectList.deleteDialogVisible, // 是否显示更新项目信息弹窗
        userManagerVisible: projectList.userManagerVisible, // 是否显示用户管理弹窗
        updateProjectInfo: projectList.updateProjectInfo, // 要更新的项目信息
        projectSearch: projectList.projectSearch, // 搜索账号输入
        searchInputVisible: projectList.searchInputVisible, //搜索框是否可见
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProjectList: (pageSize, pageNum, projectName) =>
            dispatch(fetchProjectListAction(getUID(), pageSize, pageNum, projectName)),
        pageLoadingVisible: isLoading => dispatch(projectPageLoadingAction(isLoading)),
        showUpdateDialog: visible => dispatch(showUpdateDialogAction(visible)),
        showDeleteDialog: visible => dispatch(showDeletingDialogAction(visible)),
        showUserManagerDialog: visible => dispatch(showUserManagerDialogAction(visible)),
        setUpdatingProjectInfo: index => dispatch(setUpdatingProjectInfoAction(index)),
        changeSearchInput: (search) => dispatch(changeSearchInputAction(search)),
        changeSearchVisible: (visible) => dispatch(changeSearchVisibleAction(visible)),
    }
}

export default connect(select, mapDispatchToProps)(ProjectListView);