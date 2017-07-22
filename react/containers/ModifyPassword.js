import React from "react";
import {Button, Form, Icon, Input, message} from "antd";
import {connect} from "react-redux";
import FooterView from "../components/FooterView";
import {modifyStyle} from "./styles/modifyPassword"
import {MSG_ACCOUNT, MSG_PASSWORD} from "../constants/stringConstant";
import {pageStyle} from "./styles/page";
import {ROUTER_LOGIN} from "../constants/routerConstant";
import {closeAlert, modifyPassword} from "../actions/user";
import {isStringEmpty} from "../../util/checker";

const FormItem = Form.Item;


class ModifyPassword extends React.Component {
    state = {
        confirmDirty: false,
    };


    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <div>
                {this._modifyPasswordStatus()}
                <div style={pageStyle.page_header}>
                    Demeter
                </div>
                <div style={pageStyle.page_content}>
                    <Form
                        style={modifyStyle.view_form}
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
                                style={modifyStyle.button_modify}
                                type="primary"
                                htmlType="submit">修改密码</Button>
                            <Button
                                style={modifyStyle.button_go_back}
                                onClick={()=> this.props.history.push(ROUTER_LOGIN)}>回到首页</Button>
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
                this.props.modifyPassword(values.account, values.password, values.newPassword)
            }
        });
    }

    /**
     * 修改密码状态处理
     * @private
     */
    _modifyPasswordStatus() {
        if (isStringEmpty(this.props.modifyPasswordMessage) && !this.props.alertMsg) {
            return;
        }

        if (this.props.modifyPasswordStatus === 0) {
            message.success(this.props.modifyPasswordMessage);
            this.props.history.push(ROUTER_LOGIN)
        } else {
            message.error(this.props.modifyPasswordMessage);
        }
        this.props.closeAlert();
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


export default connect(select, mapDispatchToProps)(ModifyPasswordForm);