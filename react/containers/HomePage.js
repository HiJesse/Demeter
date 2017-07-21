import React from "react";
import {Breadcrumb, Icon, Layout, Menu} from "antd";
import {connect} from "react-redux";
import FooterView from "../components/FooterView";
import {homeStyle} from "./styles/home";
import {isArrayEmpty} from "../../util/checker";
import {
    getValuesFromKey,
    MENU_ANDROID_PACKAGE,
    MENU_IOS_PACKAGE,
    MENU_PROJECT_MANAGER,
    MENU_USER_CENTER,
    MENU_USER_MANAGER
} from "../constants/menuConstant";

const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

class HomePage extends React.Component {
    state = {
        collapsed: false,
    };

    render() {
        return (
            <Layout style={homeStyle.page}>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={(collapsed) => this.setState({collapsed})}>
                    <div style={homeStyle.view_logo}/>
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        onSelect={this._onMenuSelected.bind(this)}>

                        {this._createMenu(MENU_ANDROID_PACKAGE)}
                        {this._createMenu(MENU_IOS_PACKAGE)}

                        {this._createMenu(MENU_USER_MANAGER)}
                        {this._createMenu(MENU_PROJECT_MANAGER)}
                        {this._createMenu(MENU_USER_CENTER)}
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

    /**
     * 根据常量结构创建菜单item
     * @param data
     * @returns {XML}
     * @private
     */
    _createMenu(data) {
        if (isArrayEmpty(data.MENU_SUB)) {
            return (
                <Menu.Item key={data.key}>
                    <Icon type={data.icon}/>
                    <span>{data.value}</span>
                </Menu.Item>
            );
        }

        const items = [];

        for (let i = 0; i < data.MENU_SUB.length; i++) {
            const sub = data.MENU_SUB[i];
            items.push(
                <Menu.Item key={sub.key}>{sub.value}</Menu.Item>
            );
        }

        return (
            <SubMenu
                key={data.key}
                title={
                    <span>
                        <Icon type={data.icon}/>
                        <span>{data.value}</span>
                    </span>
                }>
                {items}
            </SubMenu>
        );
    }

    _onMenuSelected(val) {
        const values = getValuesFromKey(val.key);
        console.log('jesse', values)
    }
}

function select(state) {
    return {};
}

export default connect(select)(HomePage);