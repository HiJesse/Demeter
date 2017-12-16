import React from "react";
import {loginStyle} from "./styles/LoginStyle";
import {pageStyle} from "./styles/PageStyle";
import {connect} from "react-redux";
import {login, loginAction} from "../actions/UserAction";
import {Button, Checkbox, Form, Icon, Input} from "antd";
import FooterView from "../components/FooterView";
import {goToHomePage, goToModifyPasswordPage} from "../../util/RouterUtil";
import {RES_SUCCEED} from "../../api/status/Status";
import {FORM_RULE_ACCOUNT, FROM_RULE_PASSWORD} from "../constants/FormRule";
import * as StorageUtil from "../utils/StorageUtil";

const FormItem = Form.Item;

// 登录页面
class LoginPage extends React.Component {

    constructor() {
        super();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                {this._loginStatus()}
                <div style={pageStyle.page_header}>
                    {'Demeter'}
                </div>
                <div style={pageStyle.page_content}>
                    <Form onSubmit={this._handleSubmit.bind(this)} style={loginStyle.view_form}>
                        <FormItem>
                            {getFieldDecorator('account', {
                                rules: [FORM_RULE_ACCOUNT],
                            })(
                                <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="账号"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [FROM_RULE_PASSWORD],
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
                                <div style={loginStyle.view_remember}>
                                    <Checkbox>{'记住密码'}</Checkbox>
                                </div>
                            )}
                            <a
                                style={loginStyle.text_modify_password}
                                onClick={() => goToModifyPasswordPage(this.props.history)}>
                                {'修改密码'}
                            </a>
                            <Button type="primary" htmlType="submit" style={loginStyle.button_login}>
                                {'登录'}
                            </Button>
                            <div style={loginStyle.view_contact}>
                                {'注册账号/重置密码 请联系管理员'}
                            </div>
                        </FormItem>
                    </Form>
                </div>
                <div style={pageStyle.page_footer}>
                    <FooterView />
                </div>

            </div>
        );
    }

    /**
     * 表单数据回调
     * @param e
     * @private
     */
    _handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.login(values.account, values.password);
            }
        });
    }

    /**
     * 登录状态处理
     * @private
     */
    _loginStatus() {
        if (this.props.loginStatus !== RES_SUCCEED) {
            return;
        }

        StorageUtil.setUID(this.props.uId);
        StorageUtil.setToken(this.props.token);
        StorageUtil.setAdmin(this.props.isAdmin);
        goToHomePage(this.props.history);
    }
}

const LoginPageForm = Form.create()(LoginPage);

function select(state) {
    const user = state.user;
    return {
        loginStatus: user.loginStatus, // 登录状态
        uId: user.uId, // 用户uId
        token: user.token, // 用户token
        isAdmin: user.isAdmin, // 是否为管理员
    };
}

function mapDispatchToProps(dispatch) {
    return {
        login: (account, pwd) => dispatch(loginAction(account, pwd)),
    }
}

export default connect(select, mapDispatchToProps)(LoginPageForm);