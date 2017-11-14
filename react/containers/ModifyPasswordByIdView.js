import React from "react";
import ModifyPasswordView from "../components/ModifyPasswordView";
import {modifyPasswordByIdAction} from "../actions/UserAction";
import {connect} from "react-redux";

// 个人中心-修改密码
class ModifyPasswordByIdView extends React.Component {

    render() {
        return (
            <ModifyPasswordView
                modifyByAccount={false}
                handleSubmit={(values) => {
                    this.props.modifyPassword(values.password, values.newPassword);
                }}/>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        modifyPassword: (pwd, newPwd) => dispatch(modifyPasswordByIdAction(localStorage.uId, pwd, newPwd)),
    }
}

function select(state) {
    return {
        ...state
    };
}

export default connect(select, mapDispatchToProps)(ModifyPasswordByIdView);