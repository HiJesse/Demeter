import React from "react";
import style from "./styles/login.css";
import {Affix, Button, Calendar, DatePicker, Input} from "antd";
import {connect} from "react-redux";
import {login} from "../actions/user";
import LoginForm from "../components/LoginForm";
const Search = Input.Search;

class Login extends React.Component {

    constructor() {
        super();
        this.state = {
            buttonName: 'button'
        }
    }

    render() {
        return (
            <div className={style.App}>
                <div className={style["App-header"]}>
                    <h2>{this.props.title}</h2>
                </div>
                <p className={style["App-intro"]}>
                    <DatePicker />
                    <Affix>
                        <Button type="primary" onClick={this._onClick.bind(this)}>button</Button>
                    </Affix>

                    <Search
                        placeholder="input search text"
                        style={{ width: 200 }}
                        onSearch={value => console.log(value)}
                    />
                    <Calendar onPanelChange={() => {}} />
                </p>

                <LoginForm />
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