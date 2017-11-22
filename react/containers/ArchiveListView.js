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
import {Select} from "antd";
import {ArchiveListStyle} from "./styles/ArchiveListViewStyle";

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
}

function select(state) {
    const archive = state.archive;
    return {
        selectedProject: archive.selectedProject,
        selectedPlatform: archive.selectedPlatform,
        projectList: archive.projectList,
        platformList: archive.platformList,
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