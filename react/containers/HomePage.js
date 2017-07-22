import React from "react";
import {Breadcrumb, Icon, Layout, Menu} from "antd";
import {connect} from "react-redux";
import FooterView from "../components/FooterView";
import {homeStyle} from "./styles/home";
import {isArrayEmpty, isStringEmpty} from "../../util/checker";
import {
    getValuesFromKey,
    MENU_ANDROID_PACKAGE,
    MENU_IOS_PACKAGE,
    MENU_PROJECT_MANAGER,
    MENU_USER_CENTER,
    MENU_USER_MANAGER
} from "../constants/menuConstant";
import {collapseMenu, fillSelectedMenuValues} from "../actions/home";
import {getUserInfo} from "../actions/user";

const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

class HomePage extends React.Component {

    componentDidMount() {
        this.props.getUserData();
    }

    render() {
        return (
            <Layout style={homeStyle.page}>
                <Sider
                    collapsible
                    collapsed={this.props.isCollapsed}
                    onCollapse={(collapsed) => this.props.collapseMenu(collapsed)}>
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
                    <Header style={homeStyle.page_header}>
                        {this.props.isLogin + this.props.nickName + this.props.isAdmin}
                    </Header>
                    <Content style={homeStyle.page_content}>
                        {this._createBreadCrumb()}
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

    /**
     * 根据菜单选中, 创建面包屑
     * @returns {XML}
     * @private
     */
    _createBreadCrumb() {
        const breadCrumbItems = [];

        if (!isStringEmpty(this.props.menuValue)) {
            breadCrumbItems.push(
                <Breadcrumb.Item href="">
                    <Icon type={this.props.menuValueIcon} />
                    <span>{this.props.menuValue}</span>
                </Breadcrumb.Item>
            );
        }

        if (!isStringEmpty(this.props.subMenuValue)) {
            breadCrumbItems.push(
                <Breadcrumb.Item href="">
                    <span>{this.props.subMenuValue}</span>
                </Breadcrumb.Item>
            );
        }

        return (
            <Breadcrumb style={{margin: '12px 0'}}>
                <Breadcrumb.Item href="">
                    <Icon type="home" />
                </Breadcrumb.Item>
                {breadCrumbItems}
            </Breadcrumb>
        );
    }

    /**
     * 菜单选中回调, 更新面包屑
     * @param val
     * @private
     */
    _onMenuSelected(val) {
        const values = getValuesFromKey(val.key);
        this.props.fillSelectedMenuValues(values);
    }
}

function select(state) {
    return {
        alertMsg: state.home.alertMsg,
        errorMsg: state.home.errorMsg,
        isLogin: state.home.isLogin,
        nickName: state.home.nickName,
        isAdmin: state.home.isAdmin,
        isCollapsed: state.home.isCollapsed,
        menuValue: state.home.menuValue,
        menuValueIcon: state.home.menuValueIcon,
        subMenuValue: state.home.subMenuValue
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getUserData: () => getUserInfo(dispatch, localStorage.uId),
        collapseMenu: (isCollapsed) => dispatch(collapseMenu(isCollapsed)),
        fillSelectedMenuValues: (val) => dispatch(fillSelectedMenuValues(val))
    }
}

export default connect(select, mapDispatchToProps)(HomePage);