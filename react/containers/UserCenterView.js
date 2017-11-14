import React from "react";
import {Button, Form, Input} from "antd";
import {getUserInfoAction, updateUserInfoAction} from "../actions/UserAction";
import {connect} from "react-redux";
import {FROM_RULE_NICKNAME} from "../constants/FormRule";
import {homeStyle} from "./styles/HomeStyle";

const FormItem = Form.Item;

// 个人中心-基本信息页面
class UserCenterView extends React.Component {

    componentDidMount() {
        this.props.getUserData();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form
                layout={'vertical'}
                style={{width: 300}}
                onSubmit={this._handleSubmit.bind(this)}>
                <FormItem
                    label="账号">
                    <Input
                        disabled={true}
                        defaultValue={this.props.account}/>
                </FormItem>
                <FormItem
                    label="昵称">
                    {getFieldDecorator('nickName', {
                        rules: [FROM_RULE_NICKNAME],
                        initialValue: this.props.nickName
                    })(
                        <Input />
                    )}

                </FormItem>
                <FormItem
                    label="权限">
                    <Input
                        disabled={true}
                        value={this.props.isAdmin ? '管理员' : '普通用户'}/>
                </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        style={homeStyle.button_full_width}
                        htmlType="submit">
                        {'更新基础信息'}
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
                this.props.updateUserInfo(values.nickName);
            }
        });
    }
}

const UserCenterViewForm = Form.create()(UserCenterView);

function select(state) {
    return {
        nickName: state.user.nickName,
        isAdmin: state.user.isAdmin,
        account: state.user.account,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getUserData: () => dispatch(getUserInfoAction(localStorage.uId)),
        updateUserInfo: (nickName) => dispatch(updateUserInfoAction(localStorage.uId, nickName)),
    }
}

export default connect(select, mapDispatchToProps)(UserCenterViewForm);