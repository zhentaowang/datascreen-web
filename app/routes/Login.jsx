import React from 'react';
import { hashHistory } from 'react-router';

import { Form, Input, Button, message } from 'antd';

import { Server, User, cacheData} from '../config';
import fetch from '../util/fetch';

const FormItem = Form.Item;

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    // 提交表单
    handleSubmit = (e) => {
        const _this = this;
        e.preventDefault();
        _this.props.form.validateFields((err, values) => {
            if (!err) {
                const url = Server + 'admin/login';
                const options = {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify(values)
                };
                fetch(url,options).then(data=>{
                    if(data.status===0){
                        message.success('登录成功!');
                        User.login(data);
                        cacheData.set('username',values.username);
                        hashHistory.push('/');
                    }
                    else{
                        message.error(data.display_message);
                    }
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        }

        return (
            <div id="login" className="animated zoomIn">
                <h2>龙腾管理系统</h2>
                <Form className="login-form" horizontal onSubmit={this.handleSubmit}>
                    <FormItem label="用户名" {...formItemLayout} hasFeedback>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请输入用户名!' }],
                        })(
                            <Input placeholder="Username" />
                        )}
                    </FormItem>

                    <FormItem label="密码" {...formItemLayout} hasFeedback>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码!' }],
                        })(
                            <Input type="password" placeholder="password" />
                        )}
                    </FormItem>

                    <FormItem wrapperCol={{ span: 10, offset: 6 }} style={{ marginTop: 24 }}>
                        <Button style={{width: '100%'}} type="primary" htmlType="submit">登录</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

Login = Form.create()(Login);

export default Login;