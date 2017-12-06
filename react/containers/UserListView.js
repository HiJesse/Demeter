import React from "react";
import {
    changeSearchInputAction,
    changeSearchVisibleAction,
    deleteUserAction,
    fetchUserListAction,
    pageLoadingAction,
    setUpdatingUserInfoAction,
    showUpdatingUserDialogAction
} from "../actions/UserManagerAction";
import {connect} from "react-redux";
import {Button, Icon, Input, Popconfirm, Table} from "antd";
import {userListView} from "./styles/UserListViewStyle";
import {resetPasswordAction} from "../actions/UserAction";
import UpdateUserInfoDialog from "../components/UpdateUserInfoDialog";
import {getUID} from "../utils/StorageUtil";

// 用户管理-用户列表
class UserListView extends React.Component {

    componentDidMount() {
        this._refreshPage();
    }

    render() {
        if (this.props.needRefreshData) {
            this.props.pageLoadingVisible(true);
            this.props.fetchUserList(this.props.pageSize, this.props.pageNum, this.props.accountSearch)
        }

        const columns = this._buildColumns();

        return (
            <div style={userListView.view_all}>
                <UpdateUserInfoDialog
                    data={this.props.updateUserInfo}
                    dialogVisible={this.props.updateDialogVisible}
                    onDismiss={() => {
                        this.props.setUpdatingUserInfo(-1);
                        this.props.showUpdateDialog(false);
                    }}
                    onConfirm={() => {
                        this.props.setUpdatingUserInfo(-1);
                        this.props.showUpdateDialog(false);
                        this._refreshPage();
                    }}/>
                <Table
                    bordered
                    dataSource={this.props.userList}
                    columns={columns}
                    loading={this.props.pageLoading}
                    scroll={{y: true}}
                    pagination={{
                        total: this.props.userCount,
                        pageSize: this.props.pageSize,
                        current: this.props.pageNum
                    }}
                    onChange={(pagination) => {
                        this.props.pageLoadingVisible(true);
                        this.props.fetchUserList(pagination.pageSize, pagination.current, this.props.accountSearch);
                    }}/>
            </div>
        );
    }

    /**
     * 刷新当前列表
     * @private
     */
    _refreshPage() {
        this.props.pageLoadingVisible(true);
        this.props.fetchUserList(this.props.pageSize, this.props.pageNum, this.props.accountSearch);
    }

    /**
     * 根据数据构建出各个列
     * @private
     */
    _buildColumns() {
        return [{
            title: '账号',
            dataIndex: 'account',
            width: '15%',
            filterDropdown: (
                <div style={userListView.view_search}>
                    <Input
                        placeholder="账号"
                        value={this.props.accountSearch}
                        onChange={(e) => this.props.changeSearchInput(e.target.value)}
                        onPressEnter={this._onSearch.bind(this)}
                    />
                    <Button
                        type="primary"
                        style={userListView.button_search}
                        onClick={this._onSearch.bind(this)}>搜索</Button>
                </div>
            ),
            filterIcon: <Icon type="search" style={userListView.icon_search}/>,
            filterDropdownVisible: this.props.searchInputVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.props.changeSearchVisible(visible);
            },
            render: (text) => (<div>{text}</div>),
        }, {
            title: '昵称',
            dataIndex: 'nickname',
            width: '15%',
            render: (text) => (<div>{text}</div>),
        }, {
            title: '权限',
            dataIndex: 'auth',
            width: '15%',
            render: (text) => (<div>{text}</div>),
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => {
                return this._buildOperationColumn(index)
            },
        }];
    }

    /**
     * 构建表格中行为列
     * @param index
     * @returns {XML}
     * @private
     */
    _buildOperationColumn(index) {
        return (
            <span style={userListView.view_operation}>
                    <a onClick={() => {
                        this.props.setUpdatingUserInfo(index);
                        this.props.showUpdateDialog(true);
                    }}>{'修改昵称'}</a>
                    <Popconfirm
                        title="确认重置密码?"
                        onConfirm={() => this.props.resetPassword(this.props.userList[index].account)}>
                        <a href="#">{'重置密码'}</a>
                    </Popconfirm>
                    <Popconfirm
                        title="确认删除用户?"
                        onConfirm={() => this.props.deleteUser(this.props.userList[index].account)}>
                        <a href="#">{'删除用户'}</a>
                    </Popconfirm>
                </span>
        );
    }

    /**
     * 搜索回调
     * @private
     */
    _onSearch() {
        this.props.changeSearchVisible(false);
        this.props.pageLoadingVisible(true);
        this.props.fetchUserList(this.props.pageSize, 1, this.props.accountSearch);
    }
}
function select(state) {
    const userManager = state.userManager;
    return {
        needRefreshData: userManager.needRefreshData, // 是否需要刷新数据, 有数据变化时为true
        userList: userManager.userList, // 用户列表
        pageSize: userManager.pageSize, // 分页容量
        pageNum: userManager.pageNum, // 当前页码
        userCount: userManager.userCount, // 用户总数
        pageLoading: userManager.pageLoading, // 分页loading
        accountSearch: userManager.accountSearch, // 搜索账号输入
        searchInputVisible: userManager.searchInputVisible, //搜索框是否可见
        updateDialogVisible: userManager.updateDialogVisible, // 是否显示更新用户信息弹窗
        updateUserInfo: userManager.updateUserInfo, // 要更新的用户信息
    };
}

function mapDispatchToProps(dispatch) {
    return {
        pageLoadingVisible: isLoading => dispatch(pageLoadingAction(isLoading)),
        fetchUserList: (pageSize, pageNum, accountSearch) => {
            dispatch(fetchUserListAction(getUID(), pageSize, pageNum, accountSearch));
        },
        changeSearchInput: (search) => dispatch(changeSearchInputAction(search)),
        changeSearchVisible: (visible) => dispatch(changeSearchVisibleAction(visible)),
        deleteUser: (account) => dispatch(deleteUserAction(getUID(), account)),
        resetPassword: (account) => dispatch(resetPasswordAction(account, getUID())),
        showUpdateDialog: visible => dispatch(showUpdatingUserDialogAction(visible)),
        setUpdatingUserInfo: index => dispatch(setUpdatingUserInfoAction(index)),
    }
}

export default connect(select, mapDispatchToProps)(UserListView);