import React from "react";
import {Button, Form, Icon, Input, Modal, Upload} from "antd";
import {homeStyle} from "./styles/HomeStyle";
import {connect} from "react-redux";
import {
    createProjectAction,
    getLogoFileAction,
    showLogoPreviewAction,
    uploadLogoAction
} from "../actions/ProjectManagerAction";
import {PROJECT_LOGO} from "../constants/FileConstant";
import {FROM_RULE_PROJECT_DES, FROM_RULE_PROJECT_NAME} from "../constants/FormRule";

const FormItem = Form.Item;
const {TextArea} = Input;

// 项目管理-新建项目
class CreateProjectView extends React.Component {

    componentDidMount() {
        this.props.uploadLogo(PROJECT_LOGO);
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        const {previewVisible, previewImage, logo} = this.props;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <Form
                layout={'vertical'}
                style={{width: 300}}
                onSubmit={this._handleSubmit.bind(this)}>
                <FormItem
                    label="项目Logo">
                    {getFieldDecorator('projectLogo')(
                        <div>
                            <Upload
                                action={'/upload'}
                                accept={'image/*'}
                                listType="picture-card"
                                fileList={logo}
                                onPreview={file => this.props.showLogoPreview(true, file)}
                                onChange={this.onLogoChange}
                                beforeUpload={file => this.props.getLogoFile(file)}
                                onRemove={() => {
                                    this.props.getLogoFile(undefined);
                                    return true;
                                }}
                            >
                                {logo.length >= 1 ? null : uploadButton}
                            </Upload>
                            <Modal
                                visible={previewVisible}
                                footer={null}
                                onCancel={() => this.props.showLogoPreview(false)}>
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                        </div>
                    )}
                </FormItem>
                <FormItem
                    label="项目名称">
                    {getFieldDecorator('projectName', {
                        rules: [FROM_RULE_PROJECT_NAME],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    label="项目描述">
                    {getFieldDecorator('projectDes', {
                        rules: [FROM_RULE_PROJECT_DES],
                    })(
                        <TextArea autosize={{minRows: 2, maxRows: 3}}/>
                    )}
                </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        style={homeStyle.button_full_width}
                        htmlType="submit">
                        {'创建新项目'}
                    </Button>
                </FormItem>
            </Form>
        );
    }

    /**
     * logo 变化
     */
    onLogoChange = (({fileList}) => {
        this.setState({});
        this.props.uploadLogo(fileList)
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
                this.props.createProject(values.projectName, values.projectDes, this.props.logoFile);
            }
        });
    }
}

const CreateProjectViewFrom = Form.create()(CreateProjectView);

function select(state) {
    const projectManager = state.projectManager;
    return {
        previewVisible: projectManager.previewVisible,
        previewImage: projectManager.previewImage,
        logo: projectManager.logo,
        logoFile: projectManager.logoFile
    };
}

function mapDispatchToProps(dispatch) {
    return {
        showLogoPreview: (previewVisible, file) => dispatch(showLogoPreviewAction(previewVisible, file)),
        uploadLogo: file => dispatch(uploadLogoAction(file)),
        getLogoFile: file => dispatch(getLogoFileAction(file)),
        createProject: (projectName, projectDes, projectLogo) =>
            dispatch(createProjectAction(projectName, projectDes, projectLogo)),
    }
}

export default connect(select, mapDispatchToProps)(CreateProjectViewFrom);