import React from "react";
import style from "./styles/login.css";
import {connect} from "react-redux";

class ForgetPassword extends React.Component {

    render() {
        return (
            <div className={style.page}>
                修改密码
            </div>
        );
    }
}


function select(state) {
    return {
        title: state.user.msg
    };
}

export default connect(select)(ForgetPassword);