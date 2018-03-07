import React from 'react';
import { Link } from 'react-router';

import { Table, Button, Input, message } from 'antd';
import { Server, User, cacheData } from '../config';
import fetch from '../util/fetch';


const Search = Input.Search;

const RedButton = {
    background: '#e95757',
    color: 'white'
}

export default class Chart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userList: [],
            roleMap: null
        }
    }

    componentWillMount() {
        this.getMap();
        
    }

    toZn(str){
        const arr = str.split(',');
        return arr.map(v => this.state.roleMap[v]).join(',');
    }

    getMap(){
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
                const roleMap = {};
                data.roleList.map(v => {
                    roleMap[v.value] = v.label;
                });
                _this.setState({
                    roleMap: roleMap
                });
                _this.getList();
            })
    }

    getList(){
        const _this = this;
        const formData = User.appendAccessToken({});
        const url = Server + 'admin/system_user/list';
        const options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(formData)
        };
        fetch(url,options).then(data => {
            data.userList.forEach(el => {
                el.role_id = _this.toZn(el.role_id);
            });
            _this.setState({
                userList: data.userList
            })
        })
    }

    search(value){
        const _this = this;
        const formData = User.appendAccessToken({
            username: value
        });
        const url = Server + 'admin/system_user/list';
        const options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(formData)
        };
        fetch(url,options)
            .then(data=>{
                if(data.status === 0){
                    data.userList.forEach(el => {
                        el.role_id = _this.toZn(el.role_id);
                    });
                    _this.setState({
                        userList: data.userList
                    })
                }
                else{
                    message.error('没有查询到用户');
                    _this.setState({
                        userList: []
                    })
                }
            })
    }

    render() {
        const columns = [{
            title: 'id',
            dataIndex: 'system_user_id'
        },{
            title: '用户名',
            dataIndex: 'username',
            render(text,record) {
                return <a href={`#/user/${record.username}/${record.system_user_id}`}>{text}</a>
            }
        }, {
            title: '权限',
            dataIndex: 'role_id',
        }, {
            title: '创建时间',
            dataIndex: 'created_at',
        }, {
            title: '修改时间',
            dataIndex: 'updated_at',
        },{
            title: '操作',
            render(text,record){
                return (
                    <span>
                        <Button type='primary'>
                            <Link to={`user/${record.username}/${record.system_user_id}`}>修改</Link>
                        </Button>
                        {/*&nbsp;&nbsp;&nbsp;
                        <Button style={RedButton}>删除</Button>*/}
                    </span>
                )
            }
        }]

        return (
            <div>
                <Search size='large' placeholder='请输入用户名' onSearch={this.search.bind(this)} />
                <br/>
                <Table columns={columns} dataSource={this.state.userList} bordered className='animated zoomIn'/>
            </div>
            
        )
    }
}
