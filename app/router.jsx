import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

// 引入主路由
import SiderBar from './routes/SiderBar';

// 引入单个页面（包括嵌套的子页面）
import Login from './routes/Login';
import UserList from './routes/UserList';
import UserDetail from './routes/UserDetail';
import UserAdd from './routes/UserAdd';

export default (
    <Router history={hashHistory}>
        <Route path="/" component={SiderBar}>
            <IndexRoute component={UserList} />
            <Route path="/list" component={UserList} />
            <Route path="/user/:name/:id" component={UserDetail} />
            <Route path="/add" component={UserAdd} />
        </Route>
        <Route path="/login" component={Login}></Route>
    </Router>
)