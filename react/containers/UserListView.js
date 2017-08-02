import React from "react";
import {changeSearchInput, changeSearchVisible, fetchUserList} from "../actions/userList";
import {connect} from "react-redux";
import {Button, Icon, Input, Popconfirm, Table} from "antd";
import TextEditableItemView, {TextEditableMode, TextEditableStatus} from "../components/TextEditableItemView";
import {homeStyle} from "./styles/home";
import {userListView} from "./styles/userListView";
import {resetPassword} from "../actions/user";


// 用户管理-用户列表
class UserListView extends React.Component {

    componentDidMount() {
        this.props.fetchUserList(this.props.pageSize, this.props.pageNum, this.props.accountSearch);
    }

    render() {
        const data = this.props.userList;
        const dataSource = data.map((item) => {
            const obj = {};
            Object.keys(item).forEach((key) => {
                obj[key] = key === 'key' ? item[key] : item[key].value;
            });
            return obj;
        });

        const columns = this._buildColumns();

        return (
            <div style={homeStyle.view_content}>
                <Table
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    loading={this.props.pageLoading}
                    scroll={{y: true}}
                    pagination={{
                        total: this.props.userCount,
                        pageSize: this.props.pageSize,
                        current: this.props.pageNum
                    }}
                    onChange={(pagination) => {
                        this.props.fetchUserList(pagination.pageSize, pagination.current, this.props.accountSearch);
                    }}/>
            </div>
        );
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
            render: (text, record, index) => (<div>{text}</div>),
        }, {
            title: '昵称',
            dataIndex: 'nickname',
            width: '15%',
            render: (text, record, index) => this._buildTextInputColumnItem(this.props.userList, index, 'nickname', text),
        }, {
            title: '权限',
            dataIndex: 'auth',
            width: '15%',
            render: (text, record, index) => (<div>{text}</div>),
        }, {
            title: '所属项目',
            dataIndex: 'projects',
            width: '15%',
            render: (text, record, index) => (<div>{text}</div>),
        }, {
            title: '行为',
            dataIndex: 'operation',
            render: (text, record, index) => {
                const {editable} = this.props.userList[index].account;
                return this._buildOperationColumn(index, editable)
            },
        }];
    }

    /**
     * 构建表格中行为列
     * @param index
     * @param editable
     * @returns {XML}
     * @private
     */
    _buildOperationColumn(index, editable) {
        let column;
        if (editable) {
            column = (
                <span style={userListView.view_operation}>
                    <a onClick={() => this._updateNickname(index, TextEditableStatus.SAVE)}>{'更新'}</a>
                    <Popconfirm
                        title="确定取消吗?"
                        onConfirm={() => this._updateNickname(index, TextEditableStatus.CANCEL)}>
                        <a>{'取消'}</a>
                    </Popconfirm>
                </span>
            );
        } else {
            column = (
                <span style={userListView.view_operation}>
                    <a onClick={() => this._editItem(index)}>{'修改昵称'}</a>
                    <Popconfirm
                        title="确认重置密码?"
                        onConfirm={() => this.props.resetPassword(this.props.userList[index].account.value)}>
                        <a href="#">{'重置密码'}</a>
                    </Popconfirm>
                    <a onClick={() => this._editItem(index)}>{'删除用户'}</a>
                </span>
            );
        }
        return column;
    }

    /**
     * 构建表格最小元素, 模式为 text/input
     * @param data
     * @param index
     * @param key
     * @param text
     * @returns {*}
     * @private
     */
    _buildTextInputColumnItem(data, index, key, text) {
        const {editable, status, value} = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }

        return (
            <TextEditableItemView
                editable={editable}
                mode={TextEditableMode.INPUT}
                value={value}
                status={status}
                onChange={value => {
                    const data = this.props.userList;
                    data[index][key].value = value;
                    this.setState({data});
                }}
            />);
    }

    /**
     * 保存或取消昵称的修改
     * @param index
     * @param type
     * @private
     */
    _updateNickname(index, type) {
        const data = this.props.userList;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = false;
                data[index][item].status = type;
            }
        });
        this.setState({data}, () => {
            Object.keys(data[index]).forEach((item) => {
                if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                    delete data[index][item].status;
                }
            });
        });
    }

    /**
     * 根据index 修改行数据
     * @param index
     * @private
     */
    _editItem(index) {
        const data = this.props.userList;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = true;
            }
        });
        this.setState({data});
    }

    /**
     * 搜索回调
     * @private
     */
    _onSearch() {
        this.props.changeSearchVisible(false);
        this.props.fetchUserList(this.props.pageSize, 1, this.props.accountSearch);
    }
}
function select(state) {
    return {
        userList: state.userList.userList, // 用户列表
        pageSize: state.userList.pageSize, // 分页容量
        pageNum: state.userList.pageNum, // 当前页码
        userCount: state.userList.userCount, // 用户总数
        pageLoading: state.userList.pageLoading, // 分页loading
        accountSearch: state.userList.accountSearch, // 搜索账号输入
        searchInputVisible: state.userList.searchInputVisible, //搜索框是否可见
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUserList: (pageSize, pageNum, accountSearch) => {
            fetchUserList(dispatch, localStorage.uId, pageSize, pageNum, accountSearch);
        },
        changeSearchInput: (search) => dispatch(changeSearchInput(search)),
        changeSearchVisible: (visible) => dispatch(changeSearchVisible(visible)),
        resetPassword: (account) => resetPassword(dispatch, account, localStorage.uId),
    }
}

export default connect(select, mapDispatchToProps)(UserListView);