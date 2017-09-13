import React from "react";
import {Modal} from "antd";

// 通用确认弹窗
export default class ConfirmDialog extends React.Component {

    render() {
        return (
            <Modal title={this.props.title}
                   visible={this.props.dialogVisible}
                   onOk={() => this.props.onConfirm()}
                   confirmLoading={this.props.confirmLoading === -1 ? false : this.props.confirmLoading}
                   onCancel={() => this.props.onDismiss()}
            >
                {this.props.content}
            </Modal>
        );
    }
}

ConfirmDialog.defaultProps = {
    dialogVisible: false,
    title: '确认',
    content: null,
    confirmLoading: false
};

ConfirmDialog.PropTypes = {
    dialogVisible: React.PropTypes.bool.isRequired, // 是否显示弹窗
    confirmLoading: React.PropTypes.bool.isRequired, // 确认按钮是loading
    title: React.PropTypes.string, // title
    content: React.PropTypes.object, // content null | view
    onDismiss: React.PropTypes.func.isRequired, // 关闭弹窗回调
    onConfirm: React.PropTypes.func.isRequired, // 有更新数据成功时回调
};