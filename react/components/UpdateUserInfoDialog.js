import React from "react";
import {Input, message, Modal} from "antd";
import {connect} from "react-redux";
import {isStringEmpty, isStringLengthLeast} from "../../util/CheckerUtil";
import {updateUserInfoAction, updateUserInfoLoadingAction, updateUserNicknameAction} from "../actions/UserManagerAction";

// 更新用户信息弹窗
class UpdateUserInfoDialog extends React.Component {

    componentWillReceiveProps(nextProps) {
        if (nextProps.dialogVisible && !this.props.dialogVisible) {
            this.props.updateUserNickname(nextProps.data.nickname);
        }
    }

    render() {
        const data = this.props.data;

        if (this.props.confirmLoading === false) {
            this.props.onConfirm();
            this.props.showConfirmLoading(-1);
            return null;
        }
        return (
            <Modal title={`更新 ${isStringEmpty(data.account) ? '' : data.account} 用户信息`}
                   visible={this.props.dialogVisible}
                   onOk={this._confirmDialog.bind(this)}
                   confirmLoading={this.props.confirmLoading === -1 ? false : this.props.confirmLoading}
                   onCancel={() => this.props.onDismiss()}
            >
                <div>
                    <div>{'用户昵称'}</div>
                    <Input
                        value={this.props.nickname}
                        onChange={(event) => this.props.updateUserNickname(event.target.value)}/>
                </div>
            </Modal>
        );
    }

    /**
     * 弹窗确认, 打开按钮菊花并请求接口
     * @private
     */
    _confirmDialog() {
        if (!isStringLengthLeast(this.props.nickname, 2)) {
            message.error('昵称长度最少为2位');
            return;
        }
        this.props.showConfirmLoading(true);
        this.props.updateInfo({
            uId: localStorage.uId,
            account: this.props.data.account,
            nickname: this.props.nickname
        });
    }
}

function select(state) {
    const userManager = state.userManager;
    return {
        nickname: userManager.nickname,
        confirmLoading: userManager.confirmUpdatingUserInfoLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        showConfirmLoading: visible => dispatch(updateUserInfoLoadingAction(visible)),
        updateUserNickname: nickname => dispatch(updateUserNicknameAction(nickname)),
        updateInfo: params => dispatch(updateUserInfoAction(params)),
    }
}

export default connect(select, mapDispatchToProps)(UpdateUserInfoDialog);

UpdateUserInfoDialog.PropTypes = {
    dialogVisible: React.PropTypes.bool.isRequired, // 是否显示弹窗
    onDismiss: React.PropTypes.func.isRequired, // 关闭弹窗回调
    data: React.PropTypes.object.isRequired, // 要更新的项目数据
    onConfirm: React.PropTypes.func.isRequired, // 有更新数据成功时回调
};