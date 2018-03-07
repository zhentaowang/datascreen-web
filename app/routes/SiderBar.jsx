import React from 'react';
import { Link} from 'react-router';
import { hashHistory } from 'react-router';
import { Menu, Icon, Switch } from 'antd';

import { Server, User, cacheData} from '../config';

const SubMenu = Menu.SubMenu;

class SiderBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current: '',
            username: ''
        }
    }

    componentWillMount() {
        if(User.isLogin()){
            this.getUser();
        } else{
            hashHistory.push('/login');
        }
    }

    componentDidMount() {
        
    }

    handleClick = (e) => {
        this.setState({
            current: e.key
        })
    }

    getUser = () => {
        this.setState({
            username: cacheData.get('username')
        })
    }

    logout(){
        User.logout();
        hashHistory.push('login');
    }

    render() {

        return (
            <div>
                <div id="leftMenu">
                    <img src={require('../assets/images/logo.png')} width="150" id="logo"/>
                    <Menu
                        onClick={this.handleClick}
                        style={{ width: 185 }}
                        defaultOpenKeys={['sub1', 'sub2']}
                        defaultSelectedKeys={[this.state.current]}
                        mode="inline"
                    >
                        <SubMenu key="sub1" title={<span><Icon type="setting" /><span>用户</span></span>}>
                            <Menu.Item key="1"><Link to="/list">用户列表</Link></Menu.Item>
                            <Menu.Item key="2"><Link to="/add">新增用户</Link></Menu.Item>
                            {/*<Menu.Item key="3"><Link to="/table">表格</Link></Menu.Item>
                            <Menu.Item key="4"><Link to="/form">表单</Link></Menu.Item>
                            <Menu.Item key="5"><Link to="/chart">图表</Link></Menu.Item>
                            <Menu.Item key="6"><Link to="/calendar">日历</Link></Menu.Item>*/}
                        </SubMenu>
                    </Menu>
                </div>
                <div id="rightWrap">
                    <h2 className="title">管理系统</h2>
                    <Menu mode="horizontal" onClick={this.logout}>
                        <SubMenu title={<span><Icon type="user" />{ this.state.username }</span>}>
                            <Menu.Item key="setting:1">
                                退出
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                    <div className="right-box">
                        { this.props.children }
                    </div>
                </div>
            </div>
        )
    }
}
export default SiderBar;
