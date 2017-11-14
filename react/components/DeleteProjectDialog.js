import React from "react";
import {Modal} from "antd";
import {connect} from "react-redux";
import {deleteProjectLoadingAction} from "../actions/ProjectManagerAction";
import {isStringEmpty} from "../../util/CheckerUtil";
import {deleteProjectAction} from "../actions/ProjectListAction";


// 删除项目信息弹窗
class DeleteProjectDialog extends React.Component {

    render() {
        const data = this.props.data;
        if (this.props.confirmLoading === false) {
            this.props.onConfirm();
            this.props.showConfirmLoading(-1);
            return null;
        }
        return (
            <Modal title={`删除 ${isStringEmpty(data.name) ? '' : data.name} 项目`}
                   visible={this.props.dialogVisible}
                   onOk={this._confirmDialog.bind(this)}
                   confirmLoading={this.props.confirmLoading === -1 ? false : this.props.confirmLoading}
                   onCancel={() => this.props.onDismiss()}
            >
                <div>{`确认删除 ${isStringEmpty(data.name) ? '' : data.name} 项目吗?`}</div>
            </Modal>
        );
    }

    /**
     * 弹窗确认, 打开按钮菊花并请求接口
     * @private
     */
    _confirmDialog() {
        this.props.showConfirmLoading(true);
        this.props.deleteProject(this.props.data.id);
    }
}

function select(state) {
    const projectManager = state.projectManager;
    return {
        confirmLoading: projectManager.confirmDeletingLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        showConfirmLoading: visible => dispatch(deleteProjectLoadingAction(visible)),
        deleteProject: projectId => dispatch(deleteProjectAction(localStorage.uId, projectId)),
    }
}

export default connect(select, mapDispatchToProps)(DeleteProjectDialog);

DeleteProjectDialog.PropTypes = {
    dialogVisible: React.PropTypes.bool.isRequired, // 是否显示弹窗
    onDismiss: React.PropTypes.func.isRequired, // 关闭弹窗回调
    data: React.PropTypes.object.isRequired, // 要更新的项目数据
    onConfirm: React.PropTypes.func.isRequired, // 有更新数据成功时回调
};