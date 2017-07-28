import React from "react";
import {resetPassword} from "../actions/user";
import {connect} from "react-redux";
import {Popconfirm, Table} from "antd";
import UserListItemView from "../components/ListItemView";
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

    renderColumns(data, index, key, text) {
        const {editable, status} = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }
        return (
            <UserListItemView
                editable={editable}
                value={text}
                onChange={value => this.handleChange(key, index, value)}
                status={status}
            />);
    }

    handleChange(key, index, value) {
        const {data} = this.state;
        data[index][key].value = value;
        this.setState({data});
    }

    edit(index) {
        const {data} = this.state;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = true;
            }
        });
        this.setState({data});
    }

    editDone(index, type) {
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

    render() {
        const {data} = this.state;
        const dataSource = data.map((item) => {
            const obj = {};
            Object.keys(item).forEach((key) => {
                obj[key] = key === 'key' ? item[key] : item[key].value;
            });
            return obj;
        });
        const columns = [{
            title: '账号',
            dataIndex: 'account',
            width: '15%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'account', text),
        }, {
            title: '昵称',
            dataIndex: 'nickname',
            width: '15%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'nickname', text),
        }, {
            title: '权限',
            dataIndex: 'auth',
            width: '15%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'auth', text),
        }, {
            title: '所属项目',
            dataIndex: 'projects',
            width: '15%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'projects', text),
        }, {
            title: '行为',
            dataIndex: 'operation',
            render: (text, record, index) => {
                const {editable} = this.state.data[index].account;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                                    <a onClick={() => this.editDone(index, 'save')}>Save</a>
                                    <Popconfirm title="Sure to cancel?" onConfirm={() => this.editDone(index, 'cancel')}>
                                        <a>Cancel</a>
                                    </Popconfirm>
                                </span>
                                :
                                <span style={{display: 'flex', justifyContent: 'space-around'}}>
                                    <a onClick={() => this.edit(index)}>修改昵称</a>
                                    <a onClick={() => this.edit(index)}>重置密码</a>
                                    <a onClick={() => this.edit(index)}>删除用户</a>
                                </span>
                        }
                    </div>
                );
            },
        }];
        return (
            <div style={homeStyle.view_content}>
                <Table bordered dataSource={dataSource} columns={columns}/>
            </div>
        );
    }
}
function select(state) {
    return {
        ...state
    };
}

function mapDispatchToProps(dispatch) {
    return {
        resetPassword: (account) => resetPassword(dispatch, account, localStorage.uId),
    }
}

export default connect(select, mapDispatchToProps)(UserListView);