import React from "react";
import {Button, Form, Input} from "antd";
import {homeStyle} from "./styles/home";
import {createUser} from "../actions/user";
import {connect} from "react-redux";
import {MSG_ACCOUNT} from "../constants/stringConstant";

const FormItem = Form.Item;

// 个人中心-基本信息页面
class CreateUserView extends React.Component {

    componentDidMount() {
        this.props.getUserData();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div style={homeStyle.view_content}>
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
                            htmlType="submit">
                            {'创建新用户'}
                        </Button>
                    </FormItem>
                </Form>
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
                this.props.createUser(values.account);
            }
        });
    }
}

const CreateUserViewFrom = Form.create()(CreateUserView);

function select(state) {
    return {
        ... state
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createUser: (account) => createUser(dispatch, account),
    }
}

export default connect(select, mapDispatchToProps)(CreateUserViewFrom);