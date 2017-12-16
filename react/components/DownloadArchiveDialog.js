import React from "react";
import {Modal} from "antd";
import {isObjectEmpty, isStringEmpty} from "../../util/CheckerUtil";


// 下载文档信息弹窗
export default class DownloadArchiveDialog extends React.Component {

    render() {
        const data = this.props.data;

        if (isObjectEmpty(data) || isObjectEmpty(data.project)) {
            return null;
        }

        return (
            <Modal
                title={`下载 ${isStringEmpty(data.project.projectName) ? '' : data.project.projectName} 文档`}
                visible={this.props.dialogVisible}
                onCancel={() => this.props.onDismiss()}
                footer={null}
            >
                <div>{`项目名称:  ${data.project.projectName}`}</div>
                <div>{`项目平台:  ${data.platform}`}</div>
                <div>{`文档名称:  ${data.archiveName}`}</div>
                <div>{`文档描述:  ${data.archiveDes}`}</div>
                <div>{`文档大小:  ${data.archiveSize}`}</div>
                <div>{`创建时间:  ${data.archiveCreatedAt}`}</div>
                <div>{`点击下载:  ${data.archivePath}`}</div>
            </Modal>
        );
    }
}

DownloadArchiveDialog.PropTypes = {
    dialogVisible: React.PropTypes.bool.isRequired, // 是否显示弹窗
    onDismiss: React.PropTypes.func.isRequired, // 关闭弹窗回调
    data: React.PropTypes.object.isRequired, // 要更新的项目数据
};