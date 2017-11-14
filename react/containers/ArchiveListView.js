// archive manager
import React from "react";
import {connect} from "react-redux";
import {getUID} from "../utils/StorageUtil";
import {fetchAllProjectsAction} from "../actions/ArchiveManagerAction";

/**
 * 归档管理页
 */
class ArchiveListView extends React.Component {

    componentDidMount() {
        this.props.fetchAllProjects();
    }

    render() {
        return (
            <div style={{flex: 1}}>

            </div>
        );
    }
}

function select(state) {
    const archiveList = state.archiveList;
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllProjects: () => dispatch(fetchAllProjectsAction(getUID())),
    }
}

export default connect(select, mapDispatchToProps)(ArchiveListView);