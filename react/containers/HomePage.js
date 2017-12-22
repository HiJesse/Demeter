import React from "react";
import {Breadcrumb, Button, Icon, Layout, Menu, Modal} from "antd";
import {connect} from "react-redux";
import FooterView from "../components/FooterView";
import {homeStyle} from "./styles/HomeStyle";
import {isArrayEmpty, isStringEmpty} from "../../util/CheckerUtil";
import {
    ARCHIVE_MANAGER,
    ARCHIVE_MANAGER_CREATE,
    ARCHIVE_MANAGER_LIST,
    getValuesFromKey,
    MENU_JOINED_PROJECT_LIST,
    MENU_PROJECT_MANAGER,
    MENU_USER_CENTER,
    MENU_USER_MANAGER,
    PROJECT_MANAGER_CREATE,
    PROJECT_MANAGER_LIST,
    USER_CENTER_INFO,
    USER_CENTER_PASSWORD,
    USER_MANAGER_CREATE,
    USER_MANAGER_LIST,
    USER_MANAGER_RESET_PWD,
    willRenderMenu
} from "../constants/MenuConstant";
import {collapseMenuAction, fillSelectedMenuValuesAction, fillSelectedPageContentAction} from "../actions/HomeAction";
import {getUserInfoAction} from "../actions/UserAction";
import {goToLoginPage} from "../../util/RouterUtil";
import UserCenter from "./UserCenterView";
import ModifyPasswordByIdView from "./ModifyPasswordByIdView";
import CreateUserView from "./CreateUserView";
import ResetPasswordView from "./ResetPasswordView";
import UserListView from "./UserListView";
import CreateProjectView from "./CreateProjectView";
import ProjectListView from "./ProjectListView";
import JoinedProjectListView from "./JoinedProjectListView";
import Dashboard from "./Dashboard";
import ArchiveListView from "./ArchiveListView";
import CreateArchiveView from "./CreateArchiveView";

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
                {this._loginVerify()}
                <Sider
                    style={homeStyle.view_slider}
                    collapsible
                    collapsed={this.props.isCollapsed}
                    onCollapse={(collapsed) => this.props.collapseMenu(collapsed)}>
                    <div style={homeStyle.view_logo}>
                        {this.props.isCollapsed ? 'D' : 'Demeter'}
                    </div>
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        onSelect={this._onMenuSelected.bind(this)}>

                        {this._createMenu(ARCHIVE_MANAGER)}

                        {this._createMenu(MENU_JOINED_PROJECT_LIST)}
                        {this._createMenu(MENU_PROJECT_MANAGER)}
                        {this._createMenu(MENU_USER_MANAGER)}
                        {this._createMenu(MENU_USER_CENTER)}
                    </Menu>
                </Sider>
                <Layout style={{display: 'flex'}}>
                    <Header style={homeStyle.page_header}>
                        <div style={homeStyle.text_welcome}>
                            {`欢迎 ${this.props.nickName} 用户登录`}
                        </div>
                        <div style={homeStyle.text_admin}>
                            {`账号权限: ${this.props.isAdmin ? '管理员' : '普通用户'}`}
                        </div>

                        <div style={homeStyle.view_logout}>
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
                    <Footer style={homeStyle.view_footer}>
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
        if (!willRenderMenu(this.props.isAdmin, data)) {
            return null;
        }

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
                <Breadcrumb.Item key="value">
                    <Icon type={this.props.menuValueIcon}/>
                    <span>{this.props.menuValue}</span>
                </Breadcrumb.Item>
            );
        }

        if (!isStringEmpty(this.props.subMenuValue)) {
            breadCrumbItems.push(
                <Breadcrumb.Item key="subValue">
                    <span>{this.props.subMenuValue}</span>
                </Breadcrumb.Item>
            );
        }

        if (isArrayEmpty(breadCrumbItems)) {
            breadCrumbItems.push(
                <Breadcrumb.Item key="value">
                    <Icon type="area-chart"/>
                    <span>{'仪表盘'}</span>
                </Breadcrumb.Item>
            );
        }

        return (
            <Breadcrumb style={{margin: '12px 0'}}>
                <Breadcrumb.Item key="home">
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
            case USER_CENTER_INFO:
                content = (<UserCenter />);
                break;
            case USER_CENTER_PASSWORD: {
                content = (<ModifyPasswordByIdView />);
                break;
            }
            case USER_MANAGER_CREATE:
                content = (<CreateUserView />);
                break;
            case USER_MANAGER_RESET_PWD:
                content = (<ResetPasswordView />);
                break;
            case USER_MANAGER_LIST:
                content = (<UserListView />);
                break;
            case PROJECT_MANAGER_CREATE:
                content = (<CreateProjectView />);
                break;
            case PROJECT_MANAGER_LIST:
                content = (<ProjectListView />);
                break;
            case MENU_JOINED_PROJECT_LIST.key:
                content = (<JoinedProjectListView />);
                break;
            case ARCHIVE_MANAGER_LIST:
                content = (<ArchiveListView />);
                break;
            case ARCHIVE_MANAGER_CREATE:
                content = (<CreateArchiveView />);
                break;
            default:
                content = (<Dashboard />);
        }
        return (
            <div style={homeStyle.view_content}>
                {content}
            </div>
        );
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
            goToLoginPage(this.props.history);
        }
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
                goToLoginPage(that.props.history);
            }
        });
    }
}

function select(state) {
    return {
        isLogin: state.user.isLogin, // 是否登录
        nickName: state.user.nickName, // 用户昵称
        isAdmin: state.user.isAdmin, // 用户权限
        isCollapsed: state.home.isCollapsed, // 菜单是否折叠
        menuValue: state.home.menuValue, // 一级菜单名称
        menuValueIcon: state.home.menuValueIcon, // 一级菜单图标
        subMenuValue: state.home.subMenuValue, // 二级菜单名称
        pageContent: state.home.pageContent, // 菜单触发内容页
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getUserData: () => dispatch(getUserInfoAction(localStorage.uId)),
        collapseMenu: (isCollapsed) => dispatch(collapseMenuAction(isCollapsed)),
        fillSelectedMenuValues: (val) => dispatch(fillSelectedMenuValuesAction(val)),
        fillSelectedPageContent: (val) => dispatch(fillSelectedPageContentAction(val)),
    }
}

export default connect(select, mapDispatchToProps)(HomePage);