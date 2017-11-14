import React from "react";
import {Button, Form, Input} from "antd";
import {resetPasswordAction} from "../actions/UserAction";
import {connect} from "react-redux";
import {MSG_ACCOUNT} from "../constants/StringConstant";
import {homeStyle} from "./styles/HomeStyle";

const FormItem = Form.Item;

// 用户管理-重置密码
class ResetPasswordView extends React.Component {

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form
                layout={'vertical'}
                style={{width: 300}}
                onSubmit={this._handleSubmit.bind(this)}>
                <FormItem
                    label="账号">
                    {getFieldDecorator('account', {
                        rules: [{min: 3, message: MSG_ACCOUNT}],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        style={homeStyle.button_full_width}
                        htmlType="submit">
                        {'重置密码'}
                    </Button>
                </FormItem>
            </Form>
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
                this.props.resetPassword(values.account);
            }
        });
    }
}

const ResetPasswordViewForm = Form.create()(ResetPasswordView);

function select(state) {
    return {
        ...state
    };
}

function mapDispatchToProps(dispatch) {
    return {
        resetPassword: (account) => dispatch(resetPasswordAction(account, localStorage.uId)),
    }
}

export default connect(select, mapDispatchToProps)(ResetPasswordViewForm);