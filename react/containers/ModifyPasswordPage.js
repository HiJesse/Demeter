import React from "react";
import {connect} from "react-redux";
import FooterView from "../components/FooterView";
import {pageStyle} from "./styles/PageStyle";
import {modifyPasswordAction} from "../actions/UserAction";
import ModifyPasswordView from "../components/ModifyPasswordView";
import {modifyStyle} from "./styles/ModifyPasswordStyle";
import {goToLoginPage} from "../../util/RouterUtil";
import {RES_SUCCEED} from "../../api/status/Status";


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
        if (this.props.modifyPasswordStatus === RES_SUCCEED) {
            goToLoginPage(this.props.history);
        }
    }
}


function select(state) {
    return {
        modifyPasswordStatus: state.user.modifyPasswordStatus, // 修改密码状态
    };
}

function mapDispatchToProps(dispatch) {
    return {
        modifyPassword: (account, pwd, newPwd) => dispatch(modifyPasswordAction(account, pwd, newPwd)),
    }
}


export default connect(select, mapDispatchToProps)(ModifyPasswordPage);