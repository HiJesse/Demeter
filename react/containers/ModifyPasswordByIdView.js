import React from "react";
import {homeStyle} from "./styles/home";
import ModifyPasswordView from "../components/ModifyPasswordView";
import {closeAlert, modifyPasswordById} from "../actions/user";
import {connect} from "react-redux";
import {message} from "antd";
import {isStringEmpty} from "../../util/checker";

// 个人中心-修改密码
class ModifyPasswordByIdView extends React.Component {

    render() {
        return (
            <div style={homeStyle.view_content}>
                {this._modifyPasswordStatus()}
                <ModifyPasswordView
                    modifyByAccount={false}
                    handleSubmit={(values) => {
                        this.props.modifyPassword(values.password, values.newPassword);
                    }}/>
            </div>
        );
    }

    /**
     * 修改密码状态处理
     * @private
     */
    _modifyPasswordStatus() {
        if (isStringEmpty(this.props.modifyPasswordMessage) || !this.props.alertMsg) {
            return;
        }

        if (this.props.modifyPasswordStatus === 0) { // 密码修改成功刷新当前页面
            message.success(this.props.modifyPasswordMessage, 1.5, () => location.reload());
        } else {
            message.error(this.props.modifyPasswordMessage);
        }
        this.props.closeAlert();
    }
}

function mapDispatchToProps(dispatch) {
    return {
        modifyPassword: (pwd, newPwd) => modifyPasswordById(dispatch, localStorage.uId, pwd, newPwd),
        closeAlert: () => dispatch(closeAlert)
    }
}

function select(state) {
    return {
        alertMsg: state.user.alertMsg,
        modifyPasswordStatus: state.user.modifyPasswordStatus,
        modifyPasswordMessage: state.user.modifyPasswordMessage
    };
}

export default connect(select, mapDispatchToProps)(ModifyPasswordByIdView);