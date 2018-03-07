import React from 'react';
import { hashHistory } from 'react-router';

import { Form, Input, Checkbox,  Button, Modal, message } from 'antd';

import { Server, User } from '../config';
import fetch from '../util/fetch';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

class UserDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            role_id: [],
            checkbox: []
        };
    }

    componentWillMount() {
        this.getCheckbox();
        this.getUser();
    }

    getUser() {
        const _this = this;
        const url = Server + 'admin/system_user/detail';
        const formData = User.appendAccessToken({
            system_user_id: _this.props.params.id
        });
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
                username: data.user.username,
                role_id: !data.user.role_id.length ? [] : data.user.role_id.split(',').map(v => ~~v)
            })
        })
    }

    // 提交表单
    handleSubmit = (e) => {
        const _this = this;
        e.preventDefault();
        _this.props.form.validateFields((err, values) => {
            if (!err) {
                values.system_user_id = ~~this.props.params.id;
                values.role_id = !values.role_id.length ? '' : values.role_id.join(',');
                if(!values.password){
                    delete values.password;
                }
                const url = Server + 'admin/system_user/update';
                const options = {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify(User.appendAccessToken(values))
                };
                fetch(url,options).then(data => {
                    if(data.status === 0){
                        message.success(data.display_message);
                        hashHistory.push('/');
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
        const options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(User.appendAccessToken({}))
        };
        fetch(url,options).then(data => {
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
                <FormItem label='用户名' {...formItemLayout}>
                    {getFieldDecorator('name', {
                        initialValue: this.state.username
                    })(
                        <Input placeholder='Username' disabled/>
                    )}
                </FormItem>
                <FormItem label='修改密码' {...formItemLayout} hasFeedback>
                    {getFieldDecorator('password', {
                        initialValue: '',
                        rules: [{
                            validator(rule, value, callback) {
                                if(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value) || !value.length){
                                    callback()
                                }
                                else{
                                    callback('密码必须由数字和字母组成，且长度要在6-16位之间!')
                                }
                            }
                        }]
                    })(
                        <Input type='password' placeholder='请输入修改后的密码（可不填）' />
                    )}
                </FormItem>
                <FormItem label='权限' {...formItemLayout}>
                    {getFieldDecorator('role_id', {
                        initialValue: this.state.role_id
                    })(
                        <CheckboxGroup 
                            options={this.state.checkbox}
                        />
                    )}
                </FormItem>
                <FormItem wrapperCol={{ span: 6, offset: 6 }} style={{ marginTop: 24 }}>
                    <Button type='primary' htmlType='submit'>修改信息</Button>
                </FormItem>
            </Form>
        )
    }
}

UserDetail = Form.create()(UserDetail);

export default UserDetail;