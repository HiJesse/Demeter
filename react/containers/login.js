import React from "react";
import style from "./styles/login.css";
import {connect} from "react-redux";
import {login} from "../actions/user";
import LoginForm from "../components/LoginForm";
import FooterView from "../components/FooterView";

class Login extends React.Component {

    constructor() {
        super();
        this.state = {
            buttonName: 'button'
        }
    }

    render() {
        return (
            <div className={style.page}>
                <div className={style.pageHeader}>
                    Demeter
                </div>
                <div className={style.pageContent}>
                    <LoginForm />
                </div>
                <div className={style.pageFooter}>
                    <FooterView/>
                </div>
            </div>
        );
    }

    _onClick() {
        this.props.dispatch(login());
    }
}

let i = 0;

function select(state) {
    return {
        title: state.user.msg + i++
    };
}

export default connect(select)(Login);