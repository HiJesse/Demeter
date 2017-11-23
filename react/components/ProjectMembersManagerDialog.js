import React from "react";
import {Button, Icon, Input, Modal, Popconfirm, Table} from "antd";
import {connect} from "react-redux";
import {isStringEmpty} from "../../util/CheckerUtil";
import {
    addMemberAction,
    changeUserAccountAction,
    deleteMemberAction,
    fetchMembersAction,
    initDialogDataAction,
    selectMemberAction
} from "../actions/ProjectMembersManagerAction";
import {projectUserDialogStyle} from "./styles/ProjectUserManagerDialogStyle";
import * as StorageUtil from "../utils/StorageUtil";


// 项目成员管理弹窗
class ProjectMembersManagerDialog extends React.Component {

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data && nextProps.data.id !== undefined) {
            this.props.initDialogData();
            this.props.fetchProjectMembers({
                uId: localStorage.uId,
                projectId: nextProps.data.id,
                pageNum: this.props.pageNum,
                pageSize: this.props.pageSize
            });
        }
    }

    render() {
        const data = this.props.data;

        if (this.props.refreshMembers) {
            this.props.fetchProjectMembers({
                uId: localStorage.uId,
                projectId: data.id,
                pageNum: this.props.pageNum,
                pageSize: this.props.pageSize
            });
        }

        return (
            <Modal
                title={`管理 ${isStringEmpty(data.name) ? '' : data.name} 项目成员`}
                footer={null}
                visible={this.props.dialogVisible}
                onCancel={() => this.props.onDismiss()}
            >
                <div>
                    <div>{'添加成员:'}</div>
                    <div style={projectUserDialogStyle.view_add_user}>
                        <Input
                            style={projectUserDialogStyle.input_account}
                            placeholder="输入要添加的成员账号"
                            prefix={<Icon type="user"/>}
                            value={this.props.addedAccount}
                            onChange={(e) => this.props.changeUserAccount(e.target.value)}
                        />

                        <Button
                            type="primary"
                            style={projectUserDialogStyle.button_add_user}
                            loading={this.props.addUserLoading}
                            onClick={() => this.props.addMember(this.props.data.id, this.props.addedAccount)}>
                            {'确定'}
                        </Button>
                    </div>

                    <Table
                        bordered
                        style={projectUserDialogStyle.view_member_table}
                        dataSource={this.props.projectMemberList}
                        columns={this._buildColumns()}
                        loading={this.props.projectMemberLoading}
                        scroll={{y: true}}
                        pagination={{
                            total: this.props.projectMembers,
                            pageSize: this.props.pageSize,
                            current: this.props.pageNum
                        }}
                        onChange={(pagination) => {
                            this.props.fetchProjectMembers({
                                uId: localStorage.uId,
                                projectId: this.props.data.id,
                                pageNum: pagination.current,
                                pageSize: pagination.pageSize
                            });
                        }}/>
                </div>

            </Modal>
        );
    }

    /**
     * 构建项目成员列表行属性
     * @private
     */
    _buildColumns() {
        return [{
            title: '成员账号',
            dataIndex: 'account',
            width: '15%',
            render: (text) => (<div>{text}</div>),
        }, {
            title: '成员昵称',
            dataIndex: 'nickname',
            width: '15%',
            render: (text) => (<div>{text}</div>),
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => this._buildOperationColumn(index),
        }];
    }

    /**
     * 构建列表的操作选项内容和交互
     * @param index
     * @returns {XML}
     * @private
     */
    _buildOperationColumn(index) {
        return (
            <span style={projectUserDialogStyle.view_operation}>
                <Popconfirm
                    title="确认删除该用户?"
                    onConfirm={() => {
                        this.props.deleteProjectMember({
                            uId: localStorage.uId,
                            projectId: this.props.data.id,
                            userId: this.props.memberInfo.userId,
                        });
                    }}>
                    <a href="#" onClick={() => this.props.selectMember(index)}>{'删除'}</a>
                </Popconfirm>
            </span>
        )
    }
}

function select(state) {
    const projectMembersManager = state.projectMembersManager;
    return {
        addUserLoading: projectMembersManager.addUserLoading, // 添加用户loading
        addedAccount: projectMembersManager.addedAccount, // 要添加的用户账号
        refreshMembers: projectMembersManager.refreshMembers, // 是否刷新成员列表
        memberInfo: projectMembersManager.memberInfo, // 选中的项目成员信息
        projectMemberLoading: projectMembersManager.projectMemberLoading, // 项目成员列表loading
        projectMemberList: projectMembersManager.projectMemberList, // 项目成员列表数据
        projectMembers: projectMembersManager.projectMembers, // 项目成员数量
        pageSize: projectMembersManager.pageSize, // 分页容量
        pageNum: projectMembersManager.pageNum, // 当前页码
    };
}

function mapDispatchToProps(dispatch) {
    return {
        initDialogData: () => dispatch(initDialogDataAction()), // 初始化弹窗数据
        changeUserAccount: account => dispatch(changeUserAccountAction(account)), // 实时改变用户account
        addMember: (projectId, account) => dispatch(addMemberAction(StorageUtil.getUID(), projectId, account)), // 向项目中添加用户
        fetchProjectMembers: params => dispatch(fetchMembersAction(params)), // 获取项目成员列表
        selectMember: index => dispatch(selectMemberAction(index)), // 根据index获取选中项目成员信息
        deleteProjectMember: params => dispatch(deleteMemberAction(params)), // 删除项目成员
    }
}

export default connect(select, mapDispatchToProps)(ProjectMembersManagerDialog);

ProjectMembersManagerDialog.PropTypes = {
    dialogVisible: React.PropTypes.bool.isRequired, // 是否显示弹窗
    data: React.PropTypes.object.isRequired, // 要更新的项目数据
    onDismiss: React.PropTypes.func.isRequired, // 关闭弹窗回调
};