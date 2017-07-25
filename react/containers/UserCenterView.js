import React from "react";
import {Button, Form, Input, message} from "antd";
import {homeStyle} from "./styles/home";
import {closeAlert, getUserInfo, updateUserInfo} from "../actions/user";
import {connect} from "react-redux";
import {MSG_NICKNAME} from "../constants/stringConstant";
import {isStringEmpty} from "../../util/checker";
import {RES_SUCCEED} from "../../util/status";

const FormItem = Form.Item;

// 个人中心-基本信息页面
class UserCenterView extends React.Component {

    componentDidMount() {
        this.props.getUserData();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div style={homeStyle.view_content}>
                {this._showMessage()}
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
                            rules: [{min: 3, message: MSG_NICKNAME}],
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
                            htmlType="submit">
                            {'更新基础信息'}
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
                this.props.updateUserInfo(values.nickName);
            }
        });
    }

    /**
     * 显示message
     * @private
     */
    _showMessage() {
        if (isStringEmpty(this.props.errorMsg) || !this.props.alertMsg) {
            return;
        }

        if (this.props.updateStatus === RES_SUCCEED) {
            message.success(this.props.errorMsg, 1.5, () => location.reload());
        } else {
            message.error(this.props.errorMsg);
        }

        this.props.closeAlert();
    }
}

const UserCenterViewForm = Form.create()(UserCenterView);

function select(state) {
    console.log(state.home)
    return {
        alertMsg: state.home.alertMsg,
        errorMsg: state.home.errorMsg,
        nickName: state.home.nickName,
        isAdmin: state.home.isAdmin,
        account: state.home.account,
        updateStatus: state.home.updateStatus
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getUserData: () => getUserInfo(dispatch, localStorage.uId),
        updateUserInfo: (nickName) => updateUserInfo(dispatch, localStorage.uId, nickName),
        closeAlert: () => dispatch(closeAlert)
    }
}

export default connect(select, mapDispatchToProps)(UserCenterViewForm);