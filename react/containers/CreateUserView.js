import React from "react";
import {Button, Form, Input} from "antd";
import {homeStyle} from "./styles/HomeStyle";
import {createUserAction} from "../actions/UserAction";
import {connect} from "react-redux";
import {FORM_RULE_ACCOUNT} from "../constants/FormRule";

const FormItem = Form.Item;

// 用户管理-新建用户
class CreateUserView extends React.Component {

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
                        rules: [FORM_RULE_ACCOUNT],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    label="昵称">
                    <Input
                        disabled={true}
                        value={'匿名'}/>
                </FormItem>
                <FormItem
                    label="权限">
                    <Input
                        disabled={true}
                        value={'普通用户'}/>
                </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        style={homeStyle.button_full_width}
                        htmlType="submit">
                        {'创建新用户'}
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
                this.props.createUser(values.account);
            }
        });
    }
}

const CreateUserViewFrom = Form.create()(CreateUserView);

function select(state) {
    return {
        ...state
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createUser: (account) => dispatch(createUserAction(account, localStorage.uId)),
    }
}

export default connect(select, mapDispatchToProps)(CreateUserViewFrom);