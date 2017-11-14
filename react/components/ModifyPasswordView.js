import React from "react";
import {Button, Form, Icon, Input} from "antd";
import {modifyViewStyle} from "./styles/ModifyPasswordViewStyle";
import {FORM_RULE_ACCOUNT, FROM_RULE_PASSWORD} from "../constants/FormRule";

const FormItem = Form.Item;

// 修改密码component
class ModifyPasswordView extends React.Component {
    state = {
        confirmDirty: false,
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form
                style={this.props.formStyle}
                onSubmit={this._handleSubmit.bind(this)}>

                {this._renderAccountOrUid()}

                <FormItem
                    hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [FROM_RULE_PASSWORD],
                    })(
                        <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                               placeholder="密码"/>
                    )}
                </FormItem>
                <FormItem
                    hasFeedback>
                    {getFieldDecorator('newPassword', {
                        rules: [FROM_RULE_PASSWORD, {
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
                        rules: [FROM_RULE_PASSWORD, {
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
                    {this._renderButtons()}
                </FormItem>
            </Form>
        );
    }

    /**
     * 如果是uid模式则隐藏账号输入
     * @returns {XML}
     * @private
     */
    _renderAccountOrUid() {
        const {getFieldDecorator} = this.props.form;
        if (this.props.modifyByAccount) {
            return (
                <FormItem
                    hasFeedback>
                    {getFieldDecorator('account', {
                        rules: [FORM_RULE_ACCOUNT],
                    })(
                        <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="账号"/>
                    )}
                </FormItem>
            );
        }
    }

    /**
     * 根据account|uid模式绘制不同的按钮
     * @private
     */
    _renderButtons() {
        const buttons = [];
        buttons.push(
            <Button
                key={'modify'}
                style={modifyViewStyle.button_modify}
                type="primary"
                htmlType="submit">修改密码</Button>
        );

        if (this.props.modifyByAccount) {
            buttons.push(
                <Button
                    key={'home'}
                    style={modifyViewStyle.button_go_back}
                    onClick={this.props.goHomeClicked}>回到首页</Button>
            );
        }
        return buttons;
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
                this.props.handleSubmit(values);
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

    /**
     * 关联新密码和再次输入密码
     * @param e
     * @private
     */
    _handleConfirmBlur(e) {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }
}

ModifyPasswordView.PropTypes = {
    modifyByAccount: React.PropTypes.bool.isRequired, // 是否根据账号修改, 否的话根据uId修改密码
    handleSubmit: React.PropTypes.func.isRequired, // 处理提交表单的回调
    goHomeClicked: React.PropTypes.func, // 点击回到首页的回调
    formStyle: React.PropTypes.object, // 表单样式
};

ModifyPasswordView.defaultProps = {
    modifyByAccount: true,
    formStyle: {
        width: 300
    }
};

export default Form.create()(ModifyPasswordView);