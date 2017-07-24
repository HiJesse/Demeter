import React from "react";
import {message} from "antd";
import {connect} from "react-redux";
import FooterView from "../components/FooterView";
import {pageStyle} from "./styles/page";
import {closeAlert, modifyPassword} from "../actions/user";
import {isStringEmpty} from "../../util/checker";
import ModifyPasswordView from "../components/ModifyPasswordView";
import {modifyStyle} from "./styles/modifyPassword";
import {goToLoginPage} from "../../util/router";


class ModifyPasswordPage extends React.Component {

    render() {
        return (
            <div>
                {this._modifyPasswordStatus()}
                <div style={pageStyle.page_header}>
                    Demeter
                </div>
                <div style={pageStyle.page_content}>
                    <ModifyPasswordView
                        // modifyByAccount={false}
                        formStyle={modifyStyle.view_form}
                        handleSubmit={(values) => {
                            this.props.modifyPassword(values.account, values.password, values.newPassword);
                        }}
                        goHomeClicked={() => goToLoginPage(this.props.history)}/>
                </div>
                <div style={pageStyle.page_footer}>
                    <FooterView />
                </div>
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

        if (this.props.modifyPasswordStatus === 0) {
            message.success(this.props.modifyPasswordMessage);
            goToLoginPage(this.props.history);
        } else {
            message.error(this.props.modifyPasswordMessage);
        }
        this.props.closeAlert();
    }
}


function select(state) {
    return {
        alertMsg: state.user.alertMsg,
        modifyPasswordStatus: state.user.modifyPasswordStatus,
        modifyPasswordMessage: state.user.modifyPasswordMessage
    };
}

function mapDispatchToProps(dispatch) {
    return {
        modifyPassword: (account, pwd, newPwd) => modifyPassword(dispatch, account, pwd, newPwd),
        closeAlert: () => dispatch(closeAlert)
    }
}


export default connect(select, mapDispatchToProps)(ModifyPasswordPage);