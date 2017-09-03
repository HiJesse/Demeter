import React from "react";
import {Modal} from "antd";
import {connect} from "react-redux";
import {isStringEmpty} from "../../util/checker";


// 项目成员管理弹窗
class ProjectUserManagerDialog extends React.Component {

    render() {
        const data = this.props.data;
        if (this.props.confirmLoading === false) {
            this.props.onConfirm();
            this.props.showConfirmLoading(-1);
            return null;
        }
        return (
            <Modal
                title={`管理 ${isStringEmpty(data.name) ? '' : data.name} 项目成员`}
                footer={null}
                visible={this.props.dialogVisible}
                onCancel={() => this.props.onDismiss()}
            >

            </Modal>
        );
    }
}

function select(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(select, mapDispatchToProps)(ProjectUserManagerDialog);

ProjectUserManagerDialog.PropTypes = {
    dialogVisible: React.PropTypes.bool.isRequired, // 是否显示弹窗
    data: React.PropTypes.object.isRequired, // 要更新的项目数据
    onDismiss: React.PropTypes.func.isRequired, // 关闭弹窗回调
};