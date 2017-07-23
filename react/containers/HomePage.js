import React from "react";
import {Breadcrumb, Button, Icon, Layout, Menu, message, Modal} from "antd";
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
    MENU_USER_MANAGER, USER_CENTER
} from "../constants/menuConstant";
import {collapseMenu, fillSelectedMenuValues, fillSelectedPageContent} from "../actions/home";
import {closeAlert, getUserInfo} from "../actions/user";
import {goToLogin} from "../../util/router";
import UserCenter from "./UserCenter";

const confirm = Modal.confirm;
const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

// 主页
class HomePage extends React.Component {

    state = {
        init: true,
    };

    componentDidMount() {
        this.props.getUserData();
        this.state.init = false;
    }

    render() {
        return (
            <Layout style={homeStyle.page}>
                {this._showMessage()}
                {this._loginVerify()}
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
                        <div style={{flex: 1, paddingLeft: 12}}>
                            {`欢迎 ${this.props.nickName} 用户登录`}
                        </div>
                        <div style={{flex: 1}}>
                            {`账号权限: ${this.props.isAdmin ? '管理员' : '普通用户'}`}
                        </div>

                        <div style={{
                            flex: 1,
                            paddingRight: 12,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center'
                        }}>
                            <Button
                                type="primary"
                                onClick={this._showConfirmDialog.bind(this)}>
                                {'退出登录'}
                                <Icon type="logout" style={homeStyle.button_logout}/>
                            </Button>
                        </div>


                    </Header>
                    <Content style={homeStyle.page_content}>
                        {this._createBreadCrumb()}
                        {this._renderPageContent()}
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
                    <Icon type={this.props.menuValueIcon}/>
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
                    <Icon type="home"/>
                </Breadcrumb.Item>
                {breadCrumbItems}
            </Breadcrumb>
        );
    }

    /**
     * 根据菜单选中, 填充主页内容
     * @private
     */
    _renderPageContent() {
        let content;
        switch (this.props.pageContent) {
            case USER_CENTER:
                content = (
                    <UserCenter />
                );
                break;
            default:
                content = (
                    <div style={homeStyle.view_content}>
                        {'Default'}
                    </div>
                );
        }
        return content;
    }

    /**
     * 菜单选中回调, 更新面包屑, 更新主页内容
     * @param val
     * @private
     */
    _onMenuSelected(val) {
        const values = getValuesFromKey(val.key);
        this.props.fillSelectedMenuValues(values);
        this.props.fillSelectedPageContent(values);
    }

    /**
     * 登录拦截
     * @private
     */
    _loginVerify() {
        if (!this.props.isLogin && !this.state.init) {
            this.props.closeAlert();
            goToLogin(this.props.history);
        }
    }

    /**
     * 显示message
     * @private
     */
    _showMessage() {
        if (this.state.init) {
            return;
        }
        if (isStringEmpty(this.props.errorMsg) || !this.props.alertMsg) {
            return;
        }

        message.error(this.props.errorMsg);
        this.props.closeAlert();
    }

    /**
     * 弹出确认框
     * @private
     */
    _showConfirmDialog() {
        const that = this;
        confirm({
            title: '确认退出吗?',
            onOk() {
                localStorage.token = '';
                localStorage.uId = '';
                goToLogin(that.props.history);
            }
        });
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
        subMenuValue: state.home.subMenuValue,
        pageContent: state.home.pageContent
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getUserData: () => getUserInfo(dispatch, localStorage.uId),
        collapseMenu: (isCollapsed) => dispatch(collapseMenu(isCollapsed)),
        fillSelectedMenuValues: (val) => dispatch(fillSelectedMenuValues(val)),
        fillSelectedPageContent: (val) => dispatch(fillSelectedPageContent(val)),
        closeAlert: () => dispatch(closeAlert)
    }
}

export default connect(select, mapDispatchToProps)(HomePage);