import React from "react";
import {Button, Form, Icon, Input} from "antd";
import {connect} from "react-redux";
import FooterView from "../components/FooterView";
import style from "./styles/modifyPassword.css"
import {MSG_ACCOUNT, MSG_PASSWORD} from "../constants/stringConstant";
import pageStyle from "./styles/page.css";
import {ROUTER_ROOT} from "../constants/routerConstant";

const FormItem = Form.Item;


class ModifyPassword extends React.Component {
    state = {
        confirmDirty: false,
    };


    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <div className={pageStyle.page}>
                <div className={pageStyle.pageHeader}>
                    Demeter
                </div>
                <div className={pageStyle.pageContent}>
                    <Form
                        className={style.formModifyPassword}
                        onSubmit={this._handleSubmit.bind(this)}>
                        <FormItem
                            hasFeedback>
                            {getFieldDecorator('account', {
                                rules: [{required: true, min: 3, message: MSG_ACCOUNT}],
                            })(
                                <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="账号"/>
                            )}
                        </FormItem>
                        <FormItem
                            hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, min: 6, message: MSG_PASSWORD
                                }],
                            })(
                                <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                                       placeholder="密码"/>
                            )}
                        </FormItem>
                        <FormItem
                            hasFeedback>
                            {getFieldDecorator('newPassword', {
                                rules: [{
                                    required: true, min: 6, message: MSG_PASSWORD
                                }, {
                                    validator: this._checkPassword.bind(this),
                                }],
                            })(
                                <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>}
                                       type="password"
                                       placeholder="新密码"/>
                            )}
                        </FormItem>
                        <FormItem
                            hasFeedback>
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, min: 6, message: MSG_PASSWORD
                                }, {
                                    validator: this._checkConfirmPassword.bind(this),
                                }],
                            })(
                                <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>}
                                       type="password"
                                       placeholder="确认新密码"
                                       onBlur={this._handleConfirmBlur.bind(this)}/>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button
                                className={style.buttonReset}
                                type="primary"
                                htmlType="submit">修改密码</Button>
                            <Button
                                className={style.buttonGoBack}
                                onClick={()=> this.props.history.push(ROUTER_ROOT)}>回到首页</Button>
                        </FormItem>
                    </Form>
                </div>
                <div className={pageStyle.pageFooter}>
                    <FooterView />
                </div>
            </div>
        );
    }

    /**
     * 关联新密码和再次输入密码
     * @param e
     * @private
     */
    _handleConfirmBlur(e) {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }

    /**
     *  表单提交回调
     * @param e
     * @private
     */
    _handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    /**
     * 校验新密码
     * @param rule
     * @param value
     * @param callback
     * @private
     */
    _checkPassword(rule, value, callback) {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }

    /**
     * 校验再次输入的密码
     * @param rule
     * @param value
     * @param callback
     * @private
     */
    _checkConfirmPassword(rule, value, callback) {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback(' 两次输入的新密码不一致');
        } else {
            callback();
        }
    }
}

const ModifyPasswordForm = Form.create()(ModifyPassword);

function select(state) {
    return {
        title: state.user.msg
    };
}

export default connect(select)(ModifyPasswordForm);