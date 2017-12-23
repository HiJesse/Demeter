import React from "react";
import {connect} from "react-redux";
import {Button, Form, Icon, Input, Select, Upload} from "antd";
import {homeStyle} from "./styles/HomeStyle";
import {FROM_RULE_ARCHIVE_DES} from "../constants/FormRule";
import {ArchiveListStyle} from "./styles/ArchiveListViewStyle";
import {isArrayEmpty} from "../../util/CheckerUtil";
import {fetchAllProjectsAction, selectPlatformAction, selectProjectAction} from "../actions/ArchiveManagerAction";
import * as StorageUtil from "../utils/StorageUtil";

const FormItem = Form.Item;
const {TextArea} = Input;

// 归档管理-新建归档
class CreateArchiveView extends React.Component {

    componentDidMount() {
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
     * 构建表单item 选择平台
     * @returns {XML}
     * @private
     */
    _buildArchiveUploadFormItem() {
        const {getFieldDecorator} = this.props.form;
        const archiveFile = this.props.archiveFile;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <FormItem
                label="文档上传">
                {getFieldDecorator('archive')(
                    <div>
                        <Upload
                            action={''}
                            accept={'image/*'}
                            listType="picture-card"
                            fileList={archiveFile}
                            onChange={this.onArchiveChange}
                            beforeUpload={file => this.props.getArchiveFile(file)}
                            onRemove={() => {
                                this.props.getArchiveFile(undefined);
                                return true;
                            }}
                        >
                            {!isArrayEmpty(archiveFile) && archiveFile.length >= 1 ? null : uploadButton}
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
     * archive 记录 变化
     */
    onArchiveChange = (({fileList}) => {
        this.setState({});
        // this.props.uploadArchive(fileList)
    });

    /**
     * 点击创建新项目
     * @param e
     * @private
     */
    _handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // upload archive
            }
        });
    }
}

const CreateArchiveViewFrom = Form.create()(CreateArchiveView);

function select(state) {
    const archive = state.archive;
    return {
        projectList: archive.projectList, // 项目列表
        platformList: archive.platformList, // 平台列表
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectProject: project => dispatch(selectProjectAction(project)),
        selectPlatform: platform => dispatch(selectPlatformAction(platform)),
        fetchAllProjects: () => dispatch(fetchAllProjectsAction(StorageUtil.getUID(), StorageUtil.isAdmin())),
    }
}

export default connect(select, mapDispatchToProps)(CreateArchiveViewFrom);