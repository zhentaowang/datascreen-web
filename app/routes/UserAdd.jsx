import React from 'react';
import { hashHistory } from 'react-router';

import { Form, Input, Checkbox,  Button, Modal, message } from 'antd';

import { Server, User } from '../config';
import fetch from '../util/fetch';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

class UserAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkbox: []
        };
    }

    componentWillMount() {
        this.getCheckbox();
    }

    // 提交表单
    handleSubmit = (e) => {
        e.preventDefault();
        const _this = this;
        
        _this.props.form.validateFields((err, values) => {
            if (!err) {
                values.role_id = values.role_id.join(',');
                const url = Server + 'admin/register';
                const formData = User.appendAccessToken(values);
                const options = {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify(formData)
                };
                
                fetch(url,options).then(data=>{
                    if(data.status === 0){
                        message.success(data.display_message);
                        hashHistory.push('/')
                    }
                    else{
                        message.error(data.display_message);
                    }
                })
            }
        });
    }

    getCheckbox(){
        const _this = this;
        const url = Server + 'admin/system_user/roles';
        const formData = User.appendAccessToken({});
        const options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(formData)
        };

        fetch(url,options).then(data=>{
            _this.setState({
                checkbox: data.roleList
            })
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 10 }
        }

        return (
            <Form horizontal onSubmit={this.handleSubmit} className='animated zoomIn'>
                <FormItem label='用户名' {...formItemLayout} hasFeedback>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入用户名!' }]
                    })(
                        <Input placeholder='请输入用户名' />
                    )}
                </FormItem>
                <FormItem label='密码' {...formItemLayout} hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!' },{
                            validator(rule, value, callback) {
                                if(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)){
                                    callback()
                                }
                                else{
                                    callback('密码必须由数字和字母组成，且长度要在6-16位之间!')
                                }
                            }
                        }]
                    })(
                        <Input type='password' placeholder='请输入密码' />
                    )}
                </FormItem>
                <FormItem label='权限' {...formItemLayout} required>
                    {getFieldDecorator('role_id', {
                        initialValue: this.state.role_id,
                        rules: [{ required: true, message: '请选择权限!' }]
                    })(
                        <CheckboxGroup 
                            options={this.state.checkbox}
                        />
                    )}
                </FormItem>
                <FormItem wrapperCol={{ span: 6, offset: 6 }} style={{ marginTop: 24 }}>
                    <Button type='primary' htmlType='submit'>新增用户</Button>
                </FormItem>
            </Form>
        )
    }
}

UserAdd = Form.create()(UserAdd);

export default UserAdd;