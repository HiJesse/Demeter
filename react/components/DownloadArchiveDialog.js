import React from "react";
import {Modal} from "antd";
import {isObjectEmpty, isStringEmpty} from "../../util/CheckerUtil";
import {ArchiveListStyle} from "../containers/styles/ArchiveListViewStyle";


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

                <div
                    style={ArchiveListStyle.dialog_view_download_all}>
                    {this._renderTextContent(data)}
                    <img style={ArchiveListStyle.dialog_image_download_qrCode} src=''/>

                </div>

            </Modal>
        );
    }

    /**
     * 绘制文档信息view
     * @param data
     * @returns {XML}
     * @private
     */
    _renderTextContent(data) {
        return (
            <div style={{justifyContent: 'space-between',}}>
                <div>{`项目名称:  ${data.project.projectName}`}</div>
                <div>{`项目平台:  ${data.platform}`}</div>
                <div>{`文档名称:  ${data.archiveName}`}</div>
                <div>{`文档描述:  ${data.archiveDes}`}</div>
                <div>{`文档大小:  ${data.archiveSize}`}</div>
                <div>{`创建时间:  ${data.archiveCreatedAt}`}</div>
                <div>{'下载地址:  '} <a href={`${data.archivePath}`}>{'点击下载'}</a></div>
            </div>
        )
    }
}

DownloadArchiveDialog.PropTypes = {
    dialogVisible: React.PropTypes.bool.isRequired, // 是否显示弹窗
    onDismiss: React.PropTypes.func.isRequired, // 关闭弹窗回调
    data: React.PropTypes.object.isRequired, // 要更新的项目数据
};