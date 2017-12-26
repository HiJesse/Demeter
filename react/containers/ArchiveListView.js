// archive manager
import React from "react";
import {connect} from "react-redux";
import * as StorageUtil from "../utils/StorageUtil";
import {getUID} from "../utils/StorageUtil";
import {
    deleteArchiveAction,
    fetchAllProjectsAction,
    fetchArchivesAction,
    selectArchiveDesAction,
    selectPlatformAction,
    selectProjectAction,
    setDownloadArchiveInfoAction,
    showDownloadArchiveDialogAction
} from "../actions/ArchiveManagerAction";
import {Icon, Input, Popconfirm, Select, Table} from "antd";
import {ArchiveListStyle} from "./styles/ArchiveListViewStyle";
import {isStringEmpty} from "../../util/CheckerUtil";
import DownloadArchiveDialog from "../components/DownloadArchiveDialog";

const Search = Input.Search;

/**
 * 归档管理页
 */
class ArchiveListView extends React.Component {

    componentDidMount() {
        this.props.fetchAllProjects();
        this.props.fetchArchives(this.props.pageSize, this.props.pageNum, null, null, null);
    }

    render() {
        if (this.props.needRefreshData) {
            this.props.fetchArchives(
                this.props.pageSize,
                this.props.pageNum,
                this.props.selectedProject,
                this.props.selectedPlatform,
                this.props.selectedArchiveDes,
            );
        }

        return (
            <div style={ArchiveListStyle.view_all}>
                {this._renderDownloadArchiveDialog()}
                {this._renderSelects()}
                <Table
                    bordered
                    dataSource={this.props.archiveList}
                    columns={this._buildColumns()}
                    loading={this.props.pageLoading}
                    scroll={{y: true}}
                    pagination={{
                        total: this.props.archiveCount,
                        pageSize: this.props.pageSize,
                        current: this.props.pageNum
                    }}
                    onChange={(pagination) => {
                        this.props.fetchArchives(
                            pagination.pageSize,
                            pagination.current,
                            this.props.selectedProject,
                            this.props.selectedPlatform,
                            this.props.selectedArchiveDes,
                        );
                    }}/>
            </div>
        );
    }

    /**
     * 绘制下载文档弹窗
     * @returns {XML}
     * @private
     */
    _renderDownloadArchiveDialog() {
        return (
            <DownloadArchiveDialog
                data={this.props.downloadArchiveInfo}
                dialogVisible={this.props.downloadDialogVisible}
                onDismiss={() => {
                    this.props.setDownloadArchiveInfo(-1);
                    this.props.showDownloadDialog(false);
                }}
            />
        );
    }

    /**
     * 绘制 selects 部分
     * @returns {XML}
     * @private
     */
    _renderSelects() {
        const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

        return (
            <div style={ArchiveListStyle.view_selects}>
                <Select
                    showSearch
                    style={ArchiveListStyle.select_item}
                    placeholder="选择项目"
                    optionFilterProp="children"
                    onChange={project => {
                        this.props.selectProject(project);
                        this.props.fetchArchives(
                            this.props.pageSize,
                            1,
                            project,
                            this.props.selectedPlatform,
                            this.props.selectedArchiveDes,
                        );
                    }}
                    filterOption={filterOption}
                >
                    {this._buildSelectOptions(this.props.projectList)}
                </Select>

                <Select
                    showSearch
                    style={ArchiveListStyle.select_item}
                    placeholder="选择平台"
                    optionFilterProp="children"
                    onChange={platform => {
                        this.props.selectPlatform(platform);
                        this.props.fetchArchives(
                            this.props.pageSize,
                            1,
                            this.props.selectedProject,
                            platform,
                            this.props.selectedArchiveDes,
                        );
                    }}
                    filterOption={filterOption}
                >
                    {this._buildSelectOptions(this.props.platformList)}
                </Select>

                <Search
                    placeholder="搜索文档描述"
                    style={{width: 200}}
                    onSearch={archiveDes => {
                        this.props.selectArchiveDes(archiveDes);
                        this.props.fetchArchives(
                            this.props.pageSize,
                            1,
                            this.props.selectedProject,
                            this.props.selectedPlatform,
                            archiveDes
                        );
                    }}
                />

            </div>
        );
    }

    /**
     * 根据数据构建select的子项
     * @param data
     * @private
     */
    _buildSelectOptions(data) {
        return data.map((item, index) => {
            return (
                <Select.Option
                    key={index}
                    value={item.value}
                >
                    {item.name}
                </Select.Option>
            );
        });
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
            render: (data) => (this._buildProjectInfo(data)),
        }, {
            title: '平台',
            dataIndex: 'platform',
            width: '5%',
            render: (platformId) => (this._buildPlatform(platformId)),
        }, {
            title: '文档名称',
            dataIndex: 'archiveName',
            width: '15%',
            render: (text) => (<div>{text}</div>),
        }, {
            title: '文档说明',
            dataIndex: 'archiveDes',
            width: '15%',
            render: (text) => (<div>{text}</div>),
        }, {
            title: '文档大小',
            dataIndex: 'archiveSize',
            width: '10%',
            render: (text) => (<div>{text}</div>),
        }, {
            title: '创建时间',
            dataIndex: 'archiveCreatedAt',
            width: '15%',
            render: (text) => (<div>{text}</div>),
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => {
                return this._buildOperationColumn(index)
            },
        }];
    }

    /**
     * 构建项目名称和logo column
     * @param info
     * @returns {XML}
     * @private
     */
    _buildProjectInfo(info) {
        return (
            <div style={ArchiveListStyle.view_project}>
                <img
                    style={ArchiveListStyle.image_logo}
                    src={isStringEmpty(info.projectLogo) ? '' : info.projectLogo}/>
                <div style={ArchiveListStyle.text_project_name}>
                    {info.projectName}
                </div>
            </div>
        )
    }

    /**
     * 构建平台column
     * @param platformId 平台ID
     * @returns {XML}
     * @private
     */
    _buildPlatform(platformId) {
        let platformIcon;
        if (platformId === 1) {
            platformIcon = <Icon type={'android'}/>;
        } else {
            platformIcon = <Icon type={'apple'}/>;
        }
        return (
            <div style={ArchiveListStyle.view_platform}>
                {platformIcon}
            </div>
        )
    }

    /**
     * 构建表格中行为列, 管理员: 删除文档
     * @param index
     * @returns {XML}
     * @private
     */
    _buildOperationColumn(index) {
        let deleteArchiveView = null;

        if (StorageUtil.isAdmin()) {
            deleteArchiveView = (
                <Popconfirm
                    title="确认删除文档?"
                    onConfirm={() => {
                        this.props.deleteArchive(this.props.archiveList[index].archiveId);
                    }}>
                    <a href="#">{'删除文档'}</a>
                </Popconfirm>
            );
        }

        return (
            <span style={ArchiveListStyle.view_operation}>
                <a onClick={() => {
                    this.props.setDownloadArchiveInfo(index);
                    this.props.showDownloadDialog(true);
                }}>
                    {'下载'}
                </a>

                {deleteArchiveView}
            </span>
        );
    }
}

function select(state) {
    const archive = state.archive;
    return {
        selectedProject: archive.selectedProject, // 选中的项目
        selectedPlatform: archive.selectedPlatform, // 选中的平台
        selectedArchiveDes: archive.selectedArchiveDes, // 搜索的文档描述
        projectList: archive.projectList, // 项目列表
        platformList: archive.platformList, // 平台列表
        archiveList: archive.archiveList, // 文档列表
        pageSize: archive.pageSize, // 分页容量
        pageNum: archive.pageNum, // 当前页码
        archiveCount: archive.archiveCount, // 文档总数
        pageLoading: archive.pageLoading, // 分页loading
        needRefreshData: archive.needRefreshData, // 是否需要刷新数据
        downloadDialogVisible: archive.downloadDialogVisible, // 是否显示下载文档dialog
        downloadArchiveInfo: archive.downloadArchiveInfo, // 要下载文档的信息
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectProject: project => dispatch(selectProjectAction(project)),
        selectPlatform: platform => dispatch(selectPlatformAction(platform)),
        selectArchiveDes: archiveDes => dispatch(selectArchiveDesAction(archiveDes)),
        fetchAllProjects: () => dispatch(fetchAllProjectsAction(getUID(), StorageUtil.isAdmin())),
        fetchArchives: (pageSize, pageNum, projectId, platformId, archiveDes) =>
            dispatch(fetchArchivesAction(getUID(), pageSize, pageNum, projectId, platformId, archiveDes)),
        deleteArchive: archiveId => dispatch(deleteArchiveAction(getUID(), archiveId)),
        showDownloadDialog: visible => dispatch(showDownloadArchiveDialogAction(visible)),
        setDownloadArchiveInfo: index => dispatch(setDownloadArchiveInfoAction(index)),
    }
}

export default connect(select, mapDispatchToProps)(ArchiveListView);