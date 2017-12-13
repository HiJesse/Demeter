// archive manager
import React from "react";
import {connect} from "react-redux";
import {getUID} from "../utils/StorageUtil";
import {
    fetchAllProjectsAction,
    fetchArchivesAction,
    selectPlatformAction,
    selectProjectAction
} from "../actions/ArchiveManagerAction";
import {Icon, Popconfirm, Select, Table} from "antd";
import {ArchiveListStyle} from "./styles/ArchiveListViewStyle";
import {isStringEmpty} from "../../util/CheckerUtil";

/**
 * 归档管理页
 */
class ArchiveListView extends React.Component {

    componentDidMount() {
        this.props.fetchAllProjects();
        this.props.fetchArchives(null, null);
    }

    render() {
        return (
            <div style={ArchiveListStyle.view_all}>
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
                        this.props.pageLoadingVisible(true);
                        this.props.fetchUserList(pagination.pageSize, pagination.current, this.props.accountSearch);
                    }}/>
            </div>
        );
    }

    /**
     * 绘制 selects 部分
     * @returns {XML}
     * @private
     */
    _renderSelects() {
        return (
            <div style={ArchiveListStyle.view_selects}>
                <Select
                    showSearch
                    style={ArchiveListStyle.select_item}
                    placeholder="选择项目"
                    optionFilterProp="children"
                    onChange={value => {
                        this.props.selectProject(value);
                        this.props.fetchAllProjects(value, this.props.selectedPlatform);
                    }}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {this._buildSelectOptions(this.props.projectList)}
                </Select>

                <Select
                    showSearch
                    style={ArchiveListStyle.select_item}
                    placeholder="选择平台"
                    optionFilterProp="children"
                    onChange={value => {
                        this.props.selectPlatform(value);
                        this.props.fetchAllProjects(this.props.selectedProject, value);
                    }}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {this._buildSelectOptions(this.props.platformList)}
                </Select>

            </div>
        );
    }

    /**
     * 根据数据构建select的子项
     * @param data
     * @private
     */
    _buildSelectOptions(data) {
        return data.map((item) => {
            return (
                <Option value={item.value}>{item.name}</Option>
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
            width: '15%',
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
     * 构建表格中行为列
     * @param index
     * @returns {XML}
     * @private
     */
    _buildOperationColumn(index) {
        return (
            <span style={ArchiveListStyle.view_operation}>
                <a onClick={() => {
                }}>
                    {'下载'}
                </a>

                <Popconfirm
                    title="确认删除文档?"
                    onConfirm={() => {
                    }}>
                    <a href="#">{'删除文档'}</a>
                </Popconfirm>
            </span>
        );
    }
}

function select(state) {
    const archive = state.archive;
    return {
        selectedProject: archive.selectedProject, // 选中的项目
        selectedPlatform: archive.selectedPlatform, // 选中的平台
        projectList: archive.projectList, // 项目列表
        platformList: archive.platformList, // 平台列表
        archiveList: archive.archiveList, // 文档列表
        pageSize: archive.pageSize, // 分页容量
        pageNum: archive.pageNum, // 当前页码
        archiveCount: archive.archiveCount, // 文档总数
        pageLoading: archive.pageLoading, // 分页loading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectProject: project => dispatch(selectProjectAction(project)),
        selectPlatform: platform => dispatch(selectPlatformAction(platform)),
        fetchAllProjects: () => dispatch(fetchAllProjectsAction(getUID())),
        fetchArchives: (projectId, platformId) => dispatch(fetchArchivesAction(getUID(), projectId, platformId))
    }
}

export default connect(select, mapDispatchToProps)(ArchiveListView);