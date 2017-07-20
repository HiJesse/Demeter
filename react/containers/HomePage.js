import React from "react";
import {Layout, Menu, Breadcrumb, Icon} from 'antd';
import {connect} from "react-redux";
import FooterView from "../components/FooterView";
import {homeStyle} from "./styles/home";
const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

class HomePage extends React.Component {
    state = {
        collapsed: false,
    };

    _renderUserManagerMenu() {
        return (
            <SubMenu
                key="user_manager"
                title={
                    <span>
                        <Icon type="user"/>
                        <span>{'用户管理'}</span>
                    </span>
                }>
                <Menu.Item key="user_list">{'用户列表'}</Menu.Item>
                <Menu.Item key="user_create">{'新建用户'}</Menu.Item>
                <Menu.Item key="user_reset">{'重置密码'}</Menu.Item>
            </SubMenu>
        );
    }

    _renderProjectManagerMenu() {
        return (
            <SubMenu
                key="project_manager"
                title={
                    <span>
                        <Icon type="appstore-o"/>
                        <span>{'项目管理'}</span>
                    </span>
                }>
                <Menu.Item key="project_list">{'项目列表'}</Menu.Item>
                <Menu.Item key="project_create">{'新建项目'}</Menu.Item>
                <Menu.Item key="project_delete">{'删除项目'}</Menu.Item>
            </SubMenu>
        );
    }

    render() {
        return (
            <Layout style={homeStyle.page}>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={(collapsed) => this.setState({collapsed})}>
                    <div style={homeStyle.view_logo}/>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <SubMenu
                            key="package_android_manager"
                            title={
                                <span>
                                    <Icon type="android"/>
                                    <span>{'Android包管理'}</span>
                                </span>
                            }>
                            <Menu.Item key="package_android_daily">{'DailyBuild'}</Menu.Item>
                            <Menu.Item key="package_android_channel">{'渠道包'}</Menu.Item>
                        </SubMenu>

                        <SubMenu
                            key="package_ios_manager"
                            title={
                                <span>
                                    <Icon type="apple"/>
                                    <span>{'IOS包管理'}</span>
                                </span>
                            }>
                            <Menu.Item key="package_ios_daily">{'DailyBuild'}</Menu.Item>
                            <Menu.Item key="package_ios_channel">{'渠道包'}</Menu.Item>
                        </SubMenu>

                        {this._renderUserManagerMenu()}
                        {this._renderProjectManagerMenu()}

                        <Menu.Item key="user_center">
                            <Icon type="smile"/>
                            <span>个人中心</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{display: 'flex'}}>
                    <Header style={homeStyle.page_header}/>
                    <Content style={homeStyle.page_content}>
                        <Breadcrumb style={{margin: '12px 0'}}>
                            <Breadcrumb.Item>User</Breadcrumb.Item>
                            <Breadcrumb.Item>Bill</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{padding: 24, background: '#fff', flex: 1}}>
                            {localStorage.token}
                            {localStorage.uId}
                            {localStorage.isAdmin}
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        <FooterView />
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

function select(state) {
    return {};
}

export default connect(select)(HomePage);