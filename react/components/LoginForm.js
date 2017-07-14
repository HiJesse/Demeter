import React from "react";
import {Form, Icon, Input, Button, Checkbox} from 'antd';
import formStyle from './styles/login_form.css'

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this._handleSubmit.bind(this)} className={formStyle.loginForm}>
                <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{required: true, message: '请输入你的账号!'}],
                    })(
                        <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="账号"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '请输入你的密码!'}],
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
                        <div className={formStyle.loginFormRememberPassword}>
                            <Checkbox>记住密码</Checkbox>
                        </div>
                    )}
                    <a className={formStyle.loginFormForgot} href="">忘记密码</a>
                    <Button type="primary" htmlType="submit" className={formStyle.loginFormButton}>
                        {'登录'}
                    </Button>
                    <div className={formStyle.loginFormContact}>
                        {'注册账号 请联系管理员'}
                    </div>
                </FormItem>
            </Form>
        );
    }

    _handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err && this.props.dataCallback !== undefined) {
                console.log('Received values of form: ', values);
                this.props.dataCallback(values);
            }
        });
    }
}

NormalLoginForm.PropTypes = {
    dataCallback: React.PropTypes.func, // 表单填充数据回调
};

const LoginForm = Form.create()(NormalLoginForm);

export default LoginForm;