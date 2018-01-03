import React from "react";
import {connect} from "react-redux";
import {Button, Form, Icon, Input, Select, Upload} from "antd";
import {homeStyle} from "./styles/HomeStyle";
import {FROM_RULE_ARCHIVE_DES} from "../constants/FormRule";
import {ArchiveListStyle} from "./styles/ArchiveListViewStyle";
import {fetchAllProjectsAction, selectPlatformAction, selectProjectAction} from "../actions/ArchiveManagerAction";
import * as StorageUtil from "../utils/StorageUtil";
import {getArchiveFileAction, uploadArchiveAction} from "../actions/ArchiveCreationAction";

const FormItem = Form.Item;
const {TextArea} = Input;

// 归档管理-新建归档
class CreateArchiveView extends React.Component {

    componentDidMount() {
        this.props.getArchiveFile(null);
        this.props.selectProject(null);
        this.props.selectPlatform(null);
        this.props.fetchAllProjects();
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form
                layout={'vertical'}
                style={{width: 300}}
                onSubmit={this._handleSubmit.bind(this)}>

                {this._buildArchiveUploadFormItem()}

                {this._buildSelectProjectFormItem()}

                {this._buildSelectPlatformFormItem()}

                <FormItem
                    label="文档说明">
                    {getFieldDecorator('archiveDes', {
                        rules: [FROM_RULE_ARCHIVE_DES],
                    })(
                        <TextArea autosize={{minRows: 1, maxRows: 2}}/>
                    )}
                </FormItem>

                <FormItem>
                    <Button
                        type="primary"
                        style={homeStyle.button_full_width}
                        htmlType="submit">
                        {'归档'}
                    </Button>
                </FormItem>

            </Form>
        );
    }

    /**
     * 构建表单item 上传文档
     * @returns {XML}
     * @private
     */
    _buildArchiveUploadFormItem() {
        const {getFieldDecorator} = this.props.form;

        return (
            <FormItem
                label="新建归档">
                {getFieldDecorator('archive')(
                    <div>
                        <Upload
                            disabled={this.props.uploadDisabled}
                            action={'/upload'}
                            beforeUpload={file => this.props.getArchiveFile(file)}
                            onRemove={() => {
                                this.props.getArchiveFile(null);
                                return true;
                            }}
                        >
                            <Button>
                                <Icon type="upload"/> {'点击上传'}
                            </Button>
                        </Upload>
                    </div>
                )}
            </FormItem>
        )
    }

    /**
     * 构建表单item 选择项目
     * @returns {XML}
     * @private
     */
    _buildSelectProjectFormItem() {
        const {getFieldDecorator} = this.props.form;
        const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

        return (
            <FormItem>
                {getFieldDecorator('projectName', {})(
                    <Select
                        showSearch
                        style={ArchiveListStyle.select_item}
                        placeholder="选择项目"
                        optionFilterProp="children"
                        onChange={project => {
                            this.props.selectProject(project);
                        }}
                        filterOption={filterOption}
                    >
                        {this._buildSelectOptions(this.props.projectList)}
                    </Select>
                )}
            </FormItem>
        )
    }

    /**
     * 构建表单item 选择平台
     * @returns {XML}
     * @private
     */
    _buildSelectPlatformFormItem() {
        const {getFieldDecorator} = this.props.form;
        const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

        return (
            <FormItem>
                {getFieldDecorator('platform', {})(
                    <Select
                        showSearch
                        style={ArchiveListStyle.select_item}
                        placeholder="选择平台"
                        optionFilterProp="children"
                        onChange={platform => {
                            this.props.selectPlatform(platform);
                        }}
                        filterOption={filterOption}
                    >
                        {this._buildSelectOptions(this.props.platformList)}
                    </Select>
                )}
            </FormItem>
        )
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
     * 点击创建新项目
     * @param e
     * @private
     */
    _handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.uploadArchiveFile(
                    this.props.archiveFile,
                    this.props.selectedProject,
                    this.props.selectedPlatform,
                    values.archiveDes
                );
            }
        });
    }
}

const CreateArchiveViewFrom = Form.create()(CreateArchiveView);

function select(state) {
    const archive = state.archive;
    const archiveCreation = state.archiveCreation;

    return {
        uploadDisabled: archiveCreation.uploadDisabled, //是否禁用上传
        projectList: archive.projectList, // 项目列表
        platformList: archive.platformList, // 平台列表
        archiveFile: archiveCreation.archiveFile, // 要上传的文档文件信息
        selectedProject: archive.selectedProject, // 选中的项目
        selectedPlatform: archive.selectedPlatform, // 选中的平台
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectProject: project => dispatch(selectProjectAction(project)),
        selectPlatform: platform => dispatch(selectPlatformAction(platform)),
        fetchAllProjects: () => dispatch(fetchAllProjectsAction(StorageUtil.getUID(), StorageUtil.isAdmin())),
        getArchiveFile: file => dispatch(getArchiveFileAction(file)),
        uploadArchiveFile: (file, projectId, platformId, archiveDes) =>
            dispatch(uploadArchiveAction(StorageUtil.getUID(), file, projectId, platformId, archiveDes)),
    }
}

export default connect(select, mapDispatchToProps)(CreateArchiveViewFrom);