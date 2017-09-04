import React from "react";
import {Button, Icon, Input, Modal} from "antd";
import {connect} from "react-redux";
import {isStringEmpty} from "../../util/checker";
import {addMemberAction, changeUserAccountAction} from "../actions/projectMembersManager";
import {projectUserDialogStyle} from "./styles/projectUserManagerDialog";


// 项目成员管理弹窗
class ProjectMembersManagerDialog extends React.Component {

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
                <div>
                    <div>{'添加成员:'}</div>
                    <div style={projectUserDialogStyle.view_add_user}>
                        <Input
                            style={projectUserDialogStyle.input_account}
                            placeholder="输入要添加的成员账号"
                            prefix={<Icon type="user"/>}
                            onChange={(e) => this.props.changeUserAccount(e.target.value)}
                        />

                        <Button
                            type="primary"
                            style={projectUserDialogStyle.button_add_user}
                            loading={this.props.addUserLoading}
                            onClick={() => this.props.addUser(this.props.data.id, this.props.addedAccount)}>
                            {'确定'}
                        </Button>
                    </div>
                </div>

            </Modal>
        );
    }
}

function select(state) {
    const projectMembersManager = state.projectMembersManager;
    return {
        addUserLoading: projectMembersManager.addUserLoading, // 添加用户loading
        addedAccount: projectMembersManager.addedAccount, // 要添加的用户账号
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeUserAccount: account => dispatch(changeUserAccountAction(account)), // 实时改变用户account
        addUser: (projectId, account) => dispatch(addMemberAction(localStorage.uId, projectId, account)), // 向项目中添加用户
    }
}

export default connect(select, mapDispatchToProps)(ProjectMembersManagerDialog);

ProjectMembersManagerDialog.PropTypes = {
    dialogVisible: React.PropTypes.bool.isRequired, // 是否显示弹窗
    data: React.PropTypes.object.isRequired, // 要更新的项目数据
    onDismiss: React.PropTypes.func.isRequired, // 关闭弹窗回调
};