import React from "react";
import style from "./styles/login.css";
import {connect} from "react-redux";
import {login, logout} from "../actions/user";
import {Button, Checkbox, Form, Icon, Input} from "antd";
import FooterView from "../components/FooterView";
import {md5} from "../../util/encrypt";

const FormItem = Form.Item;

class LoginPage extends React.Component {

    constructor() {
        super();
        this.state = {
            buttonName: 'button'
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className={style.page}>
                <div className={style.pageHeader}>
                    Demeter
                </div>
                <div className={style.pageContent}>
                    <Form onSubmit={this._handleSubmit.bind(this)} className={style.loginForm}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{required: true, min: 3, message: '账号至少为3个字符'}],
                            })(
                                <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="账号"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{required: true, min: 6, message: '密码至少为6个字符'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                                       placeholder="密码"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <div className={style.loginFormRememberPassword}>
                                    <Checkbox>{'记住密码'}</Checkbox>
                                </div>
                            )}
                            <a
                                className={style.loginFormForgot}
                                onClick={()=> this.props.history.push('/forgetPassword')}>
                                {'修改密码'}
                            </a>
                            <Button type="primary" htmlType="submit" className={style.loginFormButton}>
                                {'登录'}
                            </Button>
                            <div className={style.loginFormContact}>
                                {'注册账号/重置密码 请联系管理员'}
                            </div>
                        </FormItem>
                    </Form>
                </div>
                <div className={style.pageFooter}>
                    <FooterView />
                </div>
            </div>
        );
    }

    _handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch(login(values.userName, md5(values.password)));
                // this.props.dispatch(logout(values.userName));
            }
        });
    }

    _onLoginFailedCallback(data) {

    }
}

const LoginPageForm = Form.create()(LoginPage);

let i = 0;

function select(state) {
    return {
        title: state.user.msg + i++
    };
}

export default connect(select)(LoginPageForm);