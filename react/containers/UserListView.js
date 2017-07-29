import React from "react";
import {fetchUserList} from "../actions/user";
import {connect} from "react-redux";
import {Popconfirm, Table} from "antd";
import TextEditableItemView, {TextEditableMode, TextEditableStatus} from "../components/TextEditableItemView";
import {homeStyle} from "./styles/home";


// 用户管理-用户列表
class UserListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [{
                key: '0',
                account: {
                    editable: false,
                    value: 'jesse',
                },
                nickname: {
                    editable: false,
                    value: '32',
                },
                auth: {
                    editable: false,
                    value: '管理员',
                },
                projects: {
                    editable: false,
                    value: 'xxx',
                }
            }],
        };
    }

    componentDidMount() {
        this.props.fetchUserList();
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
                <Table bordered dataSource={dataSource} columns={columns} pagination={{pageSize: 10}}/>
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
            render: (text, record, index) => this._buildTextInputColumnItem(this.props.userList, index, 'account', text),
        }, {
            title: '昵称',
            dataIndex: 'nickname',
            width: '15%',
            render: (text, record, index) => this._buildTextInputColumnItem(this.props.userList, index, 'nickname', text),
        }, {
            title: '权限',
            dataIndex: 'auth',
            width: '15%',
            render: (text, record, index) => this._buildTextInputColumnItem(this.props.userList, index, 'auth', text),
        }, {
            title: '所属项目',
            dataIndex: 'projects',
            width: '15%',
            render: (text, record, index) => this._buildTextInputColumnItem(this.props.userList, index, 'projects', text),
        }, {
            title: '行为',
            dataIndex: 'operation',
            render: (text, record, index) => {
                const {editable} = this.props.userList[index].account;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                                    <a onClick={() => this._saveOrCancelItem(index, TextEditableStatus.SAVE)}>Save</a>
                                    <Popconfirm title="Sure to cancel?"
                                                onConfirm={() => this._saveOrCancelItem(index, TextEditableStatus.CANCEL)}>
                                        <a>Cancel</a>
                                    </Popconfirm>
                                </span>
                                :
                                <span style={{display: 'flex', justifyContent: 'space-around'}}>
                                    <a onClick={() => this._editItem(index)}>修改昵称</a>
                                    <a onClick={() => this._editItem(index)}>重置密码</a>
                                    <a onClick={() => this._editItem(index)}>删除用户</a>
                                </span>
                        }
                    </div>
                );
            },
        }];
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
        const {editable, status} = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }
        return (
            <TextEditableItemView
                editable={editable}
                mode={TextEditableMode.INPUT}
                value={text}
                status={status}
                onChange={value => this._handleChange(key, index, value)}
            />);
    }

    /**
     * 保存或取消item的修改
     * @param index
     * @param type
     * @private
     */
    _saveOrCancelItem(index, type) {
        const {data} = this.state;
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
        const {data} = this.state;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = true;
            }
        });
        this.setState({data});
    }

    /**
     * 用户数据变化后回调
     * @param key
     * @param index
     * @param value
     * @private
     */
    _handleChange(key, index, value) {
        const {data} = this.state;
        data[index][key].value = value;
        this.setState({data});
    }
}
function select(state) {
    return {
        userList: state.user.userList
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUserList: () => fetchUserList(dispatch, localStorage.uId),
    }
}

export default connect(select, mapDispatchToProps)(UserListView);