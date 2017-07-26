import React from "react";
import {homeStyle} from "./styles/home";
import ModifyPasswordView from "../components/ModifyPasswordView";
import {modifyPasswordById} from "../actions/user";
import {connect} from "react-redux";

// 个人中心-修改密码
class ModifyPasswordByIdView extends React.Component {

    render() {
        return (
            <div style={homeStyle.view_content}>
                <ModifyPasswordView
                    modifyByAccount={false}
                    handleSubmit={(values) => {
                        this.props.modifyPassword(values.password, values.newPassword);
                    }}/>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        modifyPassword: (pwd, newPwd) => modifyPasswordById(dispatch, localStorage.uId, pwd, newPwd),
    }
}

function select(state) {
    return {
        ... state
    };
}

export default connect(select, mapDispatchToProps)(ModifyPasswordByIdView);