import React from "react";
import {Icon, Input, message, Modal, Upload} from "antd";
import {connect} from "react-redux";
import {
    getLogoFileAction,
    updateProjectDesAction,
    updateProjectInfoAction,
    updateProjectLoadingAction,
    uploadLogoAction
} from "../actions/ProjectManagerAction";
import {isStringEmpty, isStringLengthLeast} from "../../util/CheckerUtil";
import {getUID} from "../utils/StorageUtil";

const {TextArea} = Input;

const style = {
    view_content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
};

// 更新项目信息弹窗
export class UpdateProjectInfoDialog extends React.Component {

    componentWillReceiveProps(nextProps) {
        if (nextProps.dialogVisible && !this.props.dialogVisible) {
            this.props.updateDes(nextProps.data.des);
            this.props.uploadLogo([{
                uid: -1,
                name: 'xxx.png',
                status: 'done',
                url: nextProps.data.logo,
            }]);
        }
    }

    render() {
        const logo = this.props.logo;
        const data = this.props.data;

        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        if (this.props.confirmLoading === false) {
            this.props.onConfirm();
            this.props.showConfirmLoading(-1);
            return null;
        }
        return (
            <Modal title={`更新 ${isStringEmpty(data.name) ? '' : data.name} 信息`}
                   visible={this.props.dialogVisible}
                   onOk={this._confirmDialog.bind(this)}
                   confirmLoading={this.props.confirmLoading === -1 ? false : this.props.confirmLoading}
                   onCancel={() => this.props.onDismiss()}
            >
                <div style={style.view_content}>
                    <Upload
                        action={''}
                        accept={'image/*'}
                        listType="picture-card"
                        fileList={logo}
                        onChange={({fileList}) => {
                            this.setState({});
                            this.props.uploadLogo(fileList);
                        }}
                        beforeUpload={file => this.props.getLogoFile(file)}
                        onRemove={() => {
                            this.props.getLogoFile(undefined);
                            return true;
                        }}
                    >
                        {logo.length >= 1 ? null : uploadButton}
                    </Upload>
                    <div>
                        <div>{'项目描述'}</div>
                        <TextArea
                            autosize={{minRows: 2, maxRows: 3}}
                            value={this.props.des}
                            onChange={(event) => this.props.updateDes(event.target.value)}/>
                    </div>
                </div>
            </Modal>
        );
    }

    /**
     * 弹窗确认, 打开按钮菊花并请求接口
     * @private
     */
    _confirmDialog() {
        if (!isStringLengthLeast(this.props.des, 3)) {
            message.error('项目描述长度最少为3位');
            return;
        }
        this.props.showConfirmLoading(true);
        this.props.updateInfo(this.props.data.id, this.props.logoFile, this.props.des);
    }
}

function select(state) {
    const projectManager = state.projectManager;
    return {
        logo: projectManager.logo,
        logoFile: projectManager.logoFile,
        des: projectManager.des,
        confirmLoading: projectManager.confirmLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        showConfirmLoading: visible => dispatch(updateProjectLoadingAction(visible)),
        uploadLogo: file => dispatch(uploadLogoAction(file)),
        getLogoFile: file => dispatch(getLogoFileAction(file)),
        updateDes: des => dispatch(updateProjectDesAction(des)),
        updateInfo: (projectId, logo, des) => dispatch(updateProjectInfoAction(getUID(), projectId, logo, des)),
    }
}

export default connect(select, mapDispatchToProps)(UpdateProjectInfoDialog);

UpdateProjectInfoDialog.PropTypes = {
    dialogVisible: React.PropTypes.bool.isRequired, // 是否显示弹窗
    onDismiss: React.PropTypes.func.isRequired, // 关闭弹窗回调
    data: React.PropTypes.object.isRequired, // 要更新的项目数据
    onConfirm: React.PropTypes.func.isRequired, // 有更新数据成功时回调
};